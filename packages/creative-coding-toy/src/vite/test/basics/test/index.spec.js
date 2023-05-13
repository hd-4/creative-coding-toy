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

	test("renders", async ({ page, project }) => {
		const setup_event = project.waitForLifecycleLog("setup");
		await page.goto("/tree/inspectable-p5");
		await setup_event;
	});

	test("remounts on input change used in setup", async ({ page, project }) => {
		const draw_event = project.waitForLifecycleLog("draw");
		await page.goto("/tree/inspectable-p5");
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
		await page.goto("/tree/inspectable-p5");
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
		await page.goto("/tree/inspectable-p5");
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
});
