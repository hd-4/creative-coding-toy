import { test as base } from "@playwright/test";

export const test = base.extend({
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
			}
		});
	}
});
