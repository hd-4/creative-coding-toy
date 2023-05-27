import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "@playwright/test";
import { test } from "../../test_utils.js";

test.describe("Canvas project", () => {
	test("hmr", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/canvas-hmr");
		await draw_event;
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^value_a$/ })
				.getByRole("textbox")
		).toBeVisible();

		const project_dir = fileURLToPath(
			new URL("../projects/canvas-hmr", import.meta.url)
		);
		const project_file = path.join(project_dir, "+project.js");
		const original_contents = fs.readFileSync(project_file);
		const changed_contents = fs.readFileSync(
			path.join(project_dir, "changed.js")
		);

		const next_event = project.waitForLifecycleLog();
		fs.writeFileSync(project_file, changed_contents);
		try {
			expect(await next_event).toBe("setup");
			await expect(
				page
					.locator("div")
					.filter({ hasText: /^value_b$/ })
					.getByRole("textbox")
			).toBeVisible();
		} finally {
			fs.writeFileSync(project_file, original_contents);
		}
	});
});
