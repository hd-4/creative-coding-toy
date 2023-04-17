import fs from "node:fs";
import path from "node:path";
import { friendly_name } from "./naming.js";

/**
 * @param {string} project_base
 * @returns {import("./types").Manifest}
 */
export function generate_manifest(project_base) {
	/** @type {import("./types").Project[]} */
	const projects = [];
	/** @type {import("./types").Collection[]} */
	const collections = [];

	/**
	 * @param {string} dir
	 * @param {string} basename
	 * @param {number} depth
	 * @param {{
	 * 	collection: import("./types").Collection | null;
	 * 	project: import("./types").Project | null;
	 * }} context
	 */
	function recurse(dir, basename, depth, context) {
		const absolute_dir = path.join(project_base, dir);

		const children = fs.readdirSync(absolute_dir);
		const entry = children.find((c) => /\+project\.(js|svelte)/.test(c));

		let new_context = context;
		let collection;
		let project;

		if (entry) {
			project = {
				id: dir,
				name: friendly_name(basename),
				file: path.join(dir, entry),
				depth,

				parent_collection: context.collection,
				parent_project: context.project,

				collection: null,
				parent: null,
				children: []
			};
			projects.push(project);
			if (context.collection) context.collection.empty = false;

			new_context = {
				...context,
				project: context.project || project
			};
		} else if (!context.project) {
			collection = {
				id: dir,
				name: friendly_name(basename),
				empty: true,

				projects: []
			};
			collections.push(collection);

			new_context = {
				...context,
				collection
			};
		}

		for (const child of children) {
			const absolute_path = path.join(absolute_dir, child);
			if (!fs.statSync(absolute_path).isDirectory()) continue;
			const child_relative_dir = path.join(dir, child);
			recurse(child_relative_dir, child, depth + 1, new_context);
		}

		// Don't leave empty collections around
		if (!entry && collection?.empty) {
			collections.splice(collections.indexOf(collection), 1);
		}
	}

	if (!fs.existsSync(project_base)) return { collections: [], projects: [] };

	const children_at_root = fs.readdirSync(project_base);
	for (const child of children_at_root) {
		const absolute_path = path.join(project_base, child);
		if (!fs.statSync(absolute_path).isDirectory()) continue;
		recurse(child, child, 0, {
			collection: null,
			project: null
		});
	}

	// Sort
	projects.sort((a, b) => {
		// Projects in collections always come after projects not in collections.
		if (Boolean(a.parent_collection) !== Boolean(b.parent_collection))
			return a.parent_collection ? 1 : -1;
		// Nested projects always come after their parents.
		if (a.parent_project === b) return 1;
		if (b.parent_project === a) return -1;
		// Deeper projects and their children always come after less nested projects.
		const a_depth = a.parent_project?.depth ?? a.depth;
		const b_depth = b.parent_project?.depth ?? b.depth;
		if (a_depth !== b_depth) return a_depth - b_depth;
		// Fall back to sorting by name
		return a.name.localeCompare(b.name);
	});

	// Populate parent-child project relationships and collection-project
	// relationships
	const project_indexes = new Map(projects.map((p, i) => [p, i]));
	const collection_indexes = new Map(collections.map((c, i) => [c, i]));

	for (const project of projects) {
		const index = /** @type {number} */ (project_indexes.get(project));

		if (project.parent_project) {
			project.parent = /** @type {number} */ (
				project_indexes.get(project.parent_project)
			);
			project.parent_project.children.push(index);
		}

		if (project.parent_collection) {
			project.collection = /** @type {number} */ (
				collection_indexes.get(project.parent_collection)
			);
			project.parent_collection.projects.push(index);
		}
	}

	return { projects, collections };
}
