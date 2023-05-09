import { test as base } from "@playwright/test";

export const test = base.extend({
	output: async ({ page }, use) => {
		use({
			async waitForRendered() {
				const output_values = await page.waitForFunction(() => {
					const output = window.TEST_OUTPUT;
					if (!output) return undefined;
					return Date.now() - output.updated > 100 ? output.values : undefined;
				});
				return output_values ? await output_values.jsonValue() : undefined;
			}
		});
	}
});
