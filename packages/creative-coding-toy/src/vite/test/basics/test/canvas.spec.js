import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "@playwright/test";
import { test } from "../../test_utils.js";

test.describe("Canvas project", () => {
	test("renders", async ({ page, project }) => {
		const events = project.waitForLifecycleLogs("setup", "draw");
		await page.goto("/tree/canvas-basic");
		await events;

		const canvas = page.locator("canvas");
		await expect(canvas).toBeVisible();
		expect(await canvas.getAttribute("width")).toBe("600");
		expect(await canvas.getAttribute("height")).toBe("400");
	});

	test("remounts on input change used in setup", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/canvas-basic");
		await draw_event;

		const next_event = project.waitForLifecycleLog();

		// await page.getByLabel("used_in_setup").fill("bar");
		const input = page
			.locator("div")
			.filter({ hasText: /^used_in_setup$/ })
			.getByRole("textbox");
		await input.fill("bar");
		await input.blur();

		expect(await next_event).toBe("setup");
	});

	test("redraws on input change used in draw", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/canvas-basic");
		await draw_event;

		const next_event = project.waitForLifecycleLog();

		// await page.getByLabel("used_in_draw").fill("bar");
		const input = page
			.locator("div")
			.filter({ hasText: /^used_in_draw$/ })
			.getByRole("textbox");
		await input.fill("bar");
		await input.blur();

		expect(await next_event).toBe("draw");
	});

	test("doesn't redraw on unused input change", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/canvas-basic");
		await draw_event;

		const next_event = project.waitForLifecycleLog();

		// await page.getByLabel("unused").fill("bar");
		const input = page
			.locator("div")
			.filter({ hasText: /^unused$/ })
			.getByRole("textbox");
		await input.fill("bar");
		await input.blur();

		const safe_wait_time = new Promise((resolve) => setTimeout(resolve, 250));
		const race = Promise.race([next_event, safe_wait_time]);
		expect(await race).toBeUndefined();
	});

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
