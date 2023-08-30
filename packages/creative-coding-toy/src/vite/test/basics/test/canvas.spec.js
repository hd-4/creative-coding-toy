import { expect } from "@playwright/test";
import { test } from "../../test_utils.js";

test.describe("Canvas project", () => {
	test("renders", async ({ page, project }) => {
		const events = project.waitForLifecycleLogs("setup", "draw");
		await page.goto("/tree/canvas-basic");
		await events;

		const canvas = page.locator("canvas");
		await expect(canvas).toBeVisible();

		// The dimensions of the canvas should take into account the pixel ratio
		const dpr = await page.evaluate(() => window.devicePixelRatio);
		expect(await canvas.getAttribute("width")).toBe(String(600 * dpr));
		expect(await canvas.getAttribute("height")).toBe(String(400 * dpr));
		expect(await canvas.evaluate((c) => c.style.width)).toBe("600px");
		expect(await canvas.evaluate((c) => c.style.height)).toBe("400px");
		expect(
			await canvas.evaluate((/** @type {HTMLCanvasElement} */ c) => {
				const context = c.getContext("2d");
				const matrix = context.getTransform();
				const point = matrix.transformPoint(new DOMPoint(600, 400));
				return { x: point.x, y: point.y };
			})
		).toStrictEqual({ x: 600 * dpr, y: 400 * dpr });
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

	test("calls onDestroy hook", async ({ page, project }) => {
		await page.goto("/");
		const draw_event = project.waitForLifecycleLog("draw");
		await page.getByRole("link", { name: "Canvas Destroy" }).click();
		await draw_event;

		const next_event = project.waitForLifecycleLog();
		await page.goBack();
		expect(await next_event).toBe("destroy");
	});
});
