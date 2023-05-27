import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "@playwright/test";
import { test } from "../../test_utils.js";

test.describe("Svelte project", () => {
	test("hmr", async ({ page, project }) => {
		const mount_event = project.waitForLifecycleLog("mount");
		await page.goto("/tree/svelte-hmr");
		await mount_event;
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^value_a$/ })
				.getByRole("textbox")
		).toBeVisible();
		await expect(page.getByTestId("output")).toHaveText("foo");

		const project_dir = fileURLToPath(
			new URL("../projects/svelte-hmr", import.meta.url)
		);
		const project_file = path.join(project_dir, "+project.svelte");
		const original_contents = fs.readFileSync(project_file);
		const changed_contents = fs.readFileSync(
			path.join(project_dir, "changed.svelte")
		);

		const next_events = project.waitForLifecycleLogs("destroy", "mount");
		fs.writeFileSync(project_file, changed_contents);
		try {
			await next_events;
			await expect(
				page
					.locator("div")
					.filter({ hasText: /^value_b$/ })
					.getByRole("textbox")
			).toBeVisible();
			await expect(page.getByTestId("output")).toHaveText("bar");
		} finally {
			fs.writeFileSync(project_file, original_contents);
		}
	});
});
