import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { createServer } from "vite";
import { p5_transform } from "./index.js";

const cwd = fileURLToPath(new URL(".", import.meta.url));

test("fixture: basic", async () => {
	await test_transform("p5-basic", "+project.js", "expected.js");
});

test("fixture: deduped-names", async () => {
	await test_transform("p5-deduped-names", "+project.js", "expected.js");
});

test("fixture: module-access", async () => {
	await test_transform("p5-module-access", "+project.js", "expected.js");
});

test("fixture: empty", async () => {
	await test_transform("p5-empty", "+project.js", "expected.js");
});

test.run();

/**
 * @param {string} fixture
 * @param {string} input_file
 * @param {string} output_file
 */
async function test_transform(fixture, input_file, output_file) {
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
			p5_transform()
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
