import { expect } from "@playwright/test";
import { test } from "../../test_utils.js";

test.describe("P5 project", () => {
	// TODO: move this to the SvelteKit app tests
	// test("has descriptive title", async ({ page }) => {
	// 	await page.goto("/tree/p5-project");
	// 	await expect(page).toHaveTitle(/P 5 project/i);
	// });

	test("renders", async ({ page, project }) => {
		const events = project.waitForLifecycleLogs("preload", "setup", "draw");
		await page.goto("/tree/p5-basic");
		await events;
	});

	test("remounts on input change used in preload", async ({
		page,
		project
	}) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/p5-basic");
		await draw_event;

		const next_event = project.waitForLifecycleLog();

		// await page.getByLabel("used_in_setup").fill("bar");
		const input = page
			.locator("div")
			.filter({ hasText: /^used_in_preload$/ })
			.getByRole("textbox");
		await input.fill("bar");
		await input.blur();

		expect(await next_event).toBe("preload");
	});

	test("remounts on input change used in setup", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/p5-basic");
		await draw_event;

		const next_event = project.waitForLifecycleLog();

		// await page.getByLabel("used_in_setup").fill("bar");
		const input = page
			.locator("div")
			.filter({ hasText: /^used_in_setup$/ })
			.getByRole("textbox");
		await input.fill("bar");
		await input.blur();

		expect(await next_event).toBe("preload");
	});

	test("redraws on input change used in draw", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/p5-basic");
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
		await page.goto("/tree/p5-basic");
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

	test("only renders once when navigated to from index", async ({
		page,
		project
	}) => {
		await page.goto("/");

		const events = project.waitForLifecycleLogs("preload", "setup", "draw");
		await page.getByRole("link", { name: "P 5 Basic" }).click();
		await events;

		const next_event = project.waitForLifecycleLog();
		const safe_wait_time = new Promise((resolve) => setTimeout(resolve, 250));
		const race = Promise.race([next_event, safe_wait_time]);
		expect(await race).toBeUndefined();
	});
});
