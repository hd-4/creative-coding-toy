import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { suite } from "uvu";
import * as assert from "uvu/assert";
import { createServer } from "vite";
import { p5_transform } from "./index.js";

const cwd = fileURLToPath(new URL(".", import.meta.url));

/**
 * @type {import("uvu").Test<{
 * 	root: string;
 * 	start_vite(
 * 		fixture: string,
 * 		include: import("@rollup/pluginutils").FilterPattern
 * 	): Promise<void>;
 * 	test_transform(
 * 		input_file: string,
 * 		output_file: string
 * 	): Promise<void>;
 * 	vite: import("vite").ViteDevServer;
 * }>}
 */
const test = suite();

test("fixture: basic", async (context) => {
	await context.start_vite("basic", "**/input.js");
	await context.test_transform("input.js", "expected.js");

	const id = (await context.vite.pluginContainer.resolveId("/input.js"))?.id;
	assert.ok(id);
	const info = context.vite.pluginContainer.getModuleInfo(id);
	assert.ok(
		info?.meta?.transformed_from_p5,
		"meta.transformed_from_p5 is not set"
	);
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
	assert.ok(id);
	const info = context.vite.pluginContainer.getModuleInfo(id);
	assert.not.ok(
		info?.meta?.transformed_from_p5,
		"meta.transformed_from_p5 is set"
	);
});

test("fixture: project-filename", async (context) => {
	await context.start_vite("project-filename", "**/+project.js");
	await context.test_transform("+project.js", "expected.js");
});

test.before.each((context) => {
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
		assert.fixture(actual, readFileSync(expected_path, "utf8"));
	};
});

test.after.each(async (context) => {
	await context.vite.close();
});

test.run();

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
