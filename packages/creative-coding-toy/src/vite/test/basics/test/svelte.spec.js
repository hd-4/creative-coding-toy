import { expect } from "@playwright/test";
import { test } from "../../test_utils.js";

test.describe("Svelte project", () => {
	test("renders", async ({ page }) => {
		await page.goto("/tree/svelte-basic");
		const output_element = page.getByTestId("output");
		await expect(output_element).toBeVisible();
	});

	test("responds to input changes", async ({ page }) => {
		await page.goto("/tree/svelte-basic");

		// await page.getByLabel("value_a").fill("bar");
		const input = page
			.locator("div")
			.filter({ hasText: /^value_a$/ })
			.getByRole("textbox");
		await input.fill("bar");
		await input.blur();

		await expect(page.getByTestId("output")).toHaveText("bar");
	});
});
