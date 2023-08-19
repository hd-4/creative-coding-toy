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
		expect(await active_projects.count()).toBeGreaterThanOrEqual(1);
	});

	test("has collections", async ({ page }) => {
		await page.goto("/");
		const collections = page
			.getByRole("list")
			.nth(1)
			.getByRole("listitem")
			.filter({ has: page.getByRole("list") });
		const collection_links = collections.getByRole("listitem");
		expect(await collections.count()).toBeGreaterThanOrEqual(1);
		expect(await collection_links.count()).toBeGreaterThanOrEqual(1);
	});

	test("handles invalid files", async ({ page }) => {
		await page.goto("/tree/syntax-error");

		expect(await page.getByText("500").isVisible()).toBeFalsy();
	});
});
