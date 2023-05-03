import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { createServer } from "vite";
import { p5_transform } from "./index.js";

const cwd = fileURLToPath(new URL(".", import.meta.url));

test("fixture: basic", async () => {
	await test_transform({
		fixture: "basic",
		include: "**/input.js",
		input_file: "input.js",
		output_file: "expected.js"
	});
});

test("fixture: deduped-names", async () => {
	await test_transform({
		fixture: "deduped-names",
		include: "**/input.js",
		input_file: "input.js",
		output_file: "expected.js"
	});
});

test("fixture: module-access", async () => {
	await test_transform({
		fixture: "module-access",
		include: "**/input.js",
		input_file: "input.js",
		output_file: "expected.js"
	});
});

test("fixture: empty", async () => {
	await test_transform({
		fixture: "empty",
		include: "**/input.js",
		input_file: "input.js",
		output_file: "expected.js"
	});
});

test("fixture: project-filename", async () => {
	await test_transform({
		fixture: "project-filename",
		include: "**/+project.js",
		input_file: "+project.js",
		output_file: "expected.js"
	});
});

test.run();

/**
 * @param {object} options
 * @param {string} options.include
 * @param {string} options.fixture
 * @param {string} options.input_file
 * @param {string} options.output_file
 */
async function test_transform({ include, fixture, input_file, output_file }) {
	const directory = fixture_path(fixture);
	const vite = await createServer({
		configFile: false,
		root: directory,
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

	let actual;
	try {
		const result = await vite.transformRequest(`/${input_file}`);
		if (!result) throw new Error("Input module not found!");
		actual = result.code;
	} finally {
		await vite.close();
	}

	const expected_path = path.join(directory, output_file);

	if (process.env.UPDATE_FIXTURES) {
		writeFileSync(expected_path, actual, "utf8");
	}

	assert.fixture(actual, readFileSync(expected_path, "utf8"));
}

/**
 * @param {string} fixture_name
 */
function fixture_path(fixture_name) {
	return path.join(cwd, "test_fixtures", fixture_name);
}
