import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, beforeEach, afterEach } from "vitest";
import { createServer } from "vite";
import { p5_transform } from "./index.js";

const cwd = fileURLToPath(new URL(".", import.meta.url));

test("fixture: basic", async (context) => {
	await context.start_vite("basic", "**/input.js");
	await context.test_transform("input.js", "expected.js");

	const id = (await context.vite.pluginContainer.resolveId("/input.js"))?.id;
	expect(id).toBeTruthy();
	const info = context.vite.pluginContainer.getModuleInfo(id);
	expect(info?.meta?.transformed_from_p5).toEqual(true);
});

test("fixture: deduped-names", async (context) => {
	await context.start_vite("deduped-names", "**/input.js");
	await context.test_transform("input.js", "expected.js");
});

test("fixture: module-access", async (context) => {
	await context.start_vite("module-access", "**/input.js");
	await context.test_transform("input.js", "expected.js");
});

test("fixture: empty", async (context) => {
	await context.start_vite("empty", "**/input.js");
	await context.test_transform("input.js", "expected.js");

	const id = (await context.vite.pluginContainer.resolveId("/input.js"))?.id;
	expect(id).toBeTruthy();
	const info = context.vite.pluginContainer.getModuleInfo(id);
	expect(info?.meta?.transformed_from_p5).toBeFalsy();
});

test("fixture: project-filename", async (context) => {
	await context.start_vite("project-filename", "**/+project.js");
	await context.test_transform("+project.js", "expected.js");
});

beforeEach((context) => {
	context.start_vite = async (fixture, include) => {
		context.root = fixture_path(fixture);
		context.vite = await create_vite(context.root, include);
	};

	context.test_transform = async (input_file, output_file) => {
		const result = await context.vite.transformRequest(`/${input_file}`);
		if (!result) throw new Error("Input module not found!");
		const actual = result.code;
		const expected_path = path.join(context.root, output_file);
		if (process.env.UPDATE_FIXTURES) {
			writeFileSync(expected_path, actual, "utf8");
		}
		expect(actual).toEqual(readFileSync(expected_path, "utf8"));
	};
});

afterEach(async (context) => {
	await context.vite.close();
});

/**
 * @param {string} root
 * @param {import("@rollup/pluginutils").FilterPattern} include
 */
function create_vite(root, include) {
	return createServer({
		configFile: false,
		root,
		appType: "custom",
		plugins: [
			{
				name: "provide-p5-import",
				enforce: "pre",
				resolveId(source) {
					if (source === "p5") return "/resolved/path/to/p5.js";
				},
				load(id) {
					if (id === "/resolved/path/to/p5.js") return "export {};";
				}
			},
			p5_transform({ include })
		]
	});
}

/**
 * @param {string} fixture_name
 */
function fixture_path(fixture_name) {
	return path.join(cwd, "test_fixtures", fixture_name);
}
