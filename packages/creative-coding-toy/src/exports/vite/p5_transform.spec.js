import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "uvu";
import * as assert from "uvu/assert";
import { createServer } from "vite";
import { p5_transform } from "./p5_transform.js";

const cwd = fileURLToPath(new URL(".", import.meta.url));

test("fixture: basic", async () => {
	await test_transform("basic", "+project.js", "expected.js");
});

test("fixture: empty", async () => {
	await test_transform("empty", "+project.js", "expected.js");
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
		resolve: {
			alias: {
				p5: "p5" // stops Vite from trying to resolve it
			}
		},
		plugins: [p5_transform()]
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
