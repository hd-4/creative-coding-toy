import { devices, test as base } from "@playwright/test";

export const test = base.extend({
	app: async ({ page }, use) => {
		use({
			async gotoIndex() {
				await page.goto("/");
			}
		});
	},

	project: async ({ page }, use) => {
		use({
			/**
			 * @param {string} [event]
			 */
			async waitForLifecycleLog(event) {
				const msg = await page.waitForEvent("console", async (msg) => {
					const first = await msg.args()[0].jsonValue();
					if (!first.startsWith("[test] ") || !first.endsWith("lifecycle"))
						return false;
					if (!event) return true;
					const second = await msg.args()[1].jsonValue();
					return second === event;
				});
				return await msg.args()[1].jsonValue();
			},

			/**
			 * @param {string[]} events
			 */
			async waitForLifecycleLogs(...events) {
				/** @type {string[]}  */
				const recorded = [];

				const promises = events.map((e) =>
					page
						.waitForEvent("console", async (msg) => {
							const first = await msg.args()[0].jsonValue();
							if (!first.startsWith("[test] ") || !first.endsWith("lifecycle"))
								return false;
							const second = await msg.args()[1].jsonValue();
							return second === e;
						})
						.then(async (msg) => {
							const second = await msg.args()[1].jsonValue();
							recorded.push(second);
						})
				);

				await Promise.all(promises);

				for (let i = 0; i < events.length; i++) {
					if (recorded[i] !== events[i]) {
						throw new Error(`Unexpected logs: ${JSON.stringify(recorded)}`);
					}
				}
			}
		});
	}
});

export const config = {
	testDir: "./test",

	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,

	use: {
		trace: "on-first-retry"
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome HiDPI"] }
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox HiDPI"] }
		},

		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] }
		}
	],

	webServer: {
		command: "pnpm dev",
		port: 5173,
		reuseExistingServer: !process.env.CI
	}
};
