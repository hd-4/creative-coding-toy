import { expect } from "@playwright/test";
import { test } from "../../test_utils.js";

test.describe("Svelte project", () => {
	test("renders", async ({ page }) => {
		await page.goto("/tree/svelte-basic");
		const output_element = page.getByTestId("output_a");
		await expect(output_element).toBeVisible();
	});

	test("responds to input changes", async ({ page }) => {
		await page.goto("/tree/svelte-basic");

		// await page.getByLabel("value_a").fill("bar");
		let input = page
			.locator("div")
			.filter({ hasText: /^value_a$/ })
			.getByRole("textbox");
		await input.fill("abc");
		await input.blur();

		input = page
			.locator("div")
			.filter({ hasText: /^value_b$/ })
			.getByRole("textbox");
		await input.fill("xyz");
		await input.blur();

		await expect(page.getByTestId("output_a")).toHaveText("abc");
		await expect(page.getByTestId("output_b")).toHaveText("xyz");
	});
});
