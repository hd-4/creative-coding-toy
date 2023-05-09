import { test as base } from "@playwright/test";

export const test = base.extend({
	output: async ({ page }, use) => {
		use({
			async waitForRendered() {
				const output_values = await page.waitForFunction(() => {
					const current = window.test_output;
					if (!current) return undefined;

					window.test_outputs ||= [];
					const last_entry = window.test_outputs.at(-1);

					if (last_entry?.value !== current) {
						window.test_outputs.push({
							timestamp: Date.now(),
							value: current
						});
						return undefined;
					}

					if (Date.now() - last_entry.timestamp > 100) {
						window.test_outputs = undefined;
						return current;
					}

					return undefined;
				});
				return output_values ? await output_values.jsonValue() : undefined;
			}
		});
	}
});
