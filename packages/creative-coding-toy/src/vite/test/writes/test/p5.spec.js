import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "@playwright/test";
import { test } from "../../test_utils.js";

test.describe("P5 project", () => {
	test("hmr", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/p5-hmr");
		await draw_event;
		await expect(
			page
				.locator("div")
				.filter({ hasText: /^value_a$/ })
				.getByRole("textbox")
		).toBeVisible();

		const project_dir = fileURLToPath(
			new URL("../projects/p5-hmr", import.meta.url)
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

	test("hmr without inputs", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/p5-hmr-no-inputs");
		await draw_event;

		const project_dir = fileURLToPath(
			new URL("../projects/p5-hmr-no-inputs", import.meta.url)
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
		} finally {
			fs.writeFileSync(project_file, original_contents);
		}
	});

	test("hmr after an exception", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/p5-hmr-after-exception");
		await draw_event;

		const project_dir = fileURLToPath(
			new URL("../projects/p5-hmr-after-exception", import.meta.url)
		);
		const project_file = path.join(project_dir, "+project.js");
		const original_contents = fs.readFileSync(project_file);
		const changed_contents = fs.readFileSync(
			path.join(project_dir, "changed.js")
		);

		const draw_event2 = project.waitForLifecycleLog("draw");
		fs.writeFileSync(project_file, changed_contents);
		try {
			await draw_event2;
			expect(await page.locator("canvas").count()).toBe(1);
		} finally {
			fs.writeFileSync(project_file, original_contents);
		}
	});

	test("hmr after an exception with hmr first", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/p5-hmr-after-exception2");
		await draw_event;

		const project_dir = fileURLToPath(
			new URL("../projects/p5-hmr-after-exception2", import.meta.url)
		);
		const project_file = path.join(project_dir, "+project.js");
		const original_contents = fs.readFileSync(project_file);
		const changed_contents = fs.readFileSync(
			path.join(project_dir, "changed.js")
		);

		// Trigger a successful HMR
		const draw_event2 = project.waitForLifecycleLog("draw");
		fs.writeFileSync(project_file, original_contents);
		await draw_event2;

		// Trigger HMR to a version that throws an exception
		const draw_event3 = project.waitForLifecycleLog("draw");
		fs.writeFileSync(project_file, changed_contents);
		await draw_event3;

		// Trigger HMR to the good version
		const next_event = project.waitForLifecycleLog();
		fs.writeFileSync(project_file, original_contents);
		expect(await next_event).toBe("setup");
		expect(await page.locator("canvas").count()).toBe(1);
	});
});
