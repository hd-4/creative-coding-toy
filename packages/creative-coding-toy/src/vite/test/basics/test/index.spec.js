import { test, expect } from "@playwright/test";

test.describe("Index page", () => {
	test("has descriptive title", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveTitle(/Projects/);
	});

	// TODO: move this to the SvelteKit app tests
	// test("project grid is clickable", async ({ page }) => {
	// 	await page.goto("/");
	// 	const destination = await page
	// 		.getByRole("link", { name: "P 5 Project" })
	// 		.getAttribute("href");
	// 	await page.getByRole("listitem").click();
	// 	await expect(page).toHaveURL(destination);
	// });
});

test.describe("P5 project", () => {
	test("has descriptive title", async ({ page }) => {
		await page.goto("/tree/p5-project");
		await expect(page).toHaveTitle(/P 5 project/i);
	});
});
