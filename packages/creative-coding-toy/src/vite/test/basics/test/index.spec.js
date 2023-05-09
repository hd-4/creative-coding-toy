import { expect } from "@playwright/test";
import { test } from "../../test_utils.js";

test.describe("Index page", () => {
	// TODO: move this to the SvelteKit app tests
	// test("has descriptive title", async ({ page }) => {
	// 	await page.goto("/");
	// 	await expect(page).toHaveTitle(/Projects/);
	// });
	//
	// TODO: move this to the SvelteKit app tests
	// test("project grid is clickable", async ({ page }) => {
	// 	await page.goto("/");
	// 	const destination = await page
	// 		.getByRole("link", { name: "P 5 Project" })
	// 		.getAttribute("href");
	// 	await page.getByRole("listitem").click();
	// 	await expect(page).toHaveURL(destination);
	// });

	test("has active projects", async ({ page }) => {
		await page.goto("/");
		const active_projects = page
			.getByRole("list")
			.first()
			.getByRole("listitem");
		await expect(active_projects).toHaveCount(1);
	});
});

test.describe("P5 project", () => {
	// TODO: move this to the SvelteKit app tests
	// test("has descriptive title", async ({ page }) => {
	// 	await page.goto("/tree/p5-project");
	// 	await expect(page).toHaveTitle(/P 5 project/i);
	// });

	test.only("renders", async ({ page, output }) => {
		await page.goto("/tree/inspectable-p5");
		const test_output = await output.waitForRendered();
		expect(test_output.draw_count).toBe(1);
	});
});
