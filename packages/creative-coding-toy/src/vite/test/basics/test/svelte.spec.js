import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "@playwright/test";
import { test } from "../../test_utils.js";

test.describe.configure({ mode: "serial" });

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

	// TODO: tests run in parallel mess each other up (and this fails anyway)
	// test("hmr", async ({ page }) => {
	// 	await page.goto("/tree/svelte-hmr");
	// 	await expect(
	// 		page
	// 			.locator("div")
	// 			.filter({ hasText: /^value_a$/ })
	// 			.getByRole("textbox")
	// 	).toBeVisible();
	// 	await expect(page.getByTestId("output")).toHaveText("foo");
	// 	const project_dir = fileURLToPath(
	// 		new URL("../projects/svelte-hmr", import.meta.url)
	// 	);
	// 	const project_file = path.join(project_dir, "+project.svelte");
	// 	const original_contents = fs.readFileSync(project_file);
	// 	const changed_contents = fs.readFileSync(
	// 		path.join(project_dir, "changed.svelte")
	// 	);

	// 	fs.writeFileSync(project_file, changed_contents);
	// 	try {
	// 		await expect(
	// 			page
	// 				.locator("div")
	// 				.filter({ hasText: /^value_b$/ })
	// 				.getByRole("textbox")
	// 		).toBeVisible();
	// 		await expect(page.getByTestId("output")).toHaveText("bar");
	// 	} finally {
	// 		fs.writeFileSync(project_file, original_contents);
	// 	}
	// });
});
