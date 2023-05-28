import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";
import { generate_manifest } from "./index.js";

const cwd = fileURLToPath(new URL(".", import.meta.url));

test("fixture: basic", () => {
	const directory = fixture_path("basic");
	const { projects, collections } = generate_manifest(directory);

	expect(projects.map(simplify_project)).toEqual([
		{
			id: "project"
		},
		{
			id: "project2",
			children: [2]
		},
		{
			id: "project2/assoc",
			parent: 1
		},
		{
			id: "collection/project",
			collection: 0
		}
	]);

	expect(collections.map(simplify_collection)).toEqual([
		{
			id: "collection",
			projects: [3]
		}
	]);
});

test("fixture: nested-projects", () => {
	const directory = fixture_path("nested-projects");
	const { projects, collections } = generate_manifest(directory);

	expect(projects.map(simplify_project)).toEqual([
		{
			id: "root1",
			children: [1, 2]
		},
		{
			id: "root1/a",
			parent: 0
		},
		{
			id: "root1/a/b",
			parent: 0
		},
		{
			id: "root2",
			children: [4]
		},
		{
			id: "root2/a/b",
			parent: 3
		}
	]);

	expect(collections.map(simplify_collection)).toEqual([]);
});

test("fixture: nested-collections", () => {
	const directory = fixture_path("nested-collections");
	const { projects, collections } = generate_manifest(directory);

	expect(projects.map(simplify_project)).toEqual([
		{
			id: "a/p1",
			collection: 0
		},
		{
			id: "a/b/p2",
			collection: 1
		}
	]);

	expect(collections.map(simplify_collection)).toEqual([
		{
			id: "a",
			projects: [0]
		},
		{
			id: "a/b",
			projects: [1]
		}
	]);
});

test("fixture: nested-collections-empty", () => {
	const directory = fixture_path("nested-collections-empty");
	const { projects, collections } = generate_manifest(directory);

	expect(projects.map(simplify_project)).toEqual([
		{
			id: "a/b/p1",
			collection: 0
		}
	]);

	expect(collections.map(simplify_collection)).toEqual([
		{
			id: "a/b",
			projects: [0]
		}
	]);
});

test("non-existent directory", () => {
	const { projects, collections } = generate_manifest(
		path.join(cwd, "nonexistent")
	);
	expect(projects).toEqual([]);
	expect(collections).toEqual([]);
});

test("fixture: names", () => {
	const directory = fixture_path("names");
	const { projects, collections } = generate_manifest(directory);

	expect(projects.map((p) => p.name)).toEqual([
		"Camel Case",
		"iNTENTIONAL Caps",
		"Kebab Case",
		"Mixed Separators Dash-Underscore",
		"Numbered 1",
		"Pascal Case",
		"Pascal Case with ACRONYM",
		"Snake Case",
		"Snake Case WithCamel",
		"Snake with 1numbers",
		"Snake with Numbers 1",
		"Space Separated",
		"Tagged (ACRONYM)",
		"Tagged (brackets)",
		"Tagged (category)",
		"Tagged (long category)",
		"Tagged (pascal case)",
		"Tagged (with parens)",
		"Tagged Badly",
		"Tagged Badly 2.",
		"Tagged but (ambiguous)",
		"Nested Project"
	]);

	expect(collections.map((c) => c.name)).toEqual(["Camel Case Collection"]);
});

test("fixture: svelte", () => {
	const directory = fixture_path("svelte");
	const { projects, collections } = generate_manifest(directory);

	expect(projects.map(simplify_project)).toEqual([
		{
			id: "project"
		}
	]);

	expect(collections.map(simplify_collection)).toEqual([]);
});

/**
 * @param {string} fixture_name
 */
function fixture_path(fixture_name) {
	return path.join(cwd, "test_fixtures", fixture_name);
}

/**
 * @param {import("./types").Project} project
 */
function simplify_project(project) {
	/** @type {{id: string, collection?: number, parent?: number, children?: number[]}} */
	const result = { id: project.id };
	if (project.collection !== null) result.collection = project.collection;
	if (project.parent !== null) result.parent = project.parent;
	if (project.children?.length) result.children = project.children;
	return result;
}

/**
 * @param {import("./types").Collection} collection
 */
function simplify_collection(collection) {
	/** @type {{id: string, projects?: number[]}} */
	const result = { id: collection.id };
	if (collection.projects?.length) result.projects = collection.projects;
	return result;
}
