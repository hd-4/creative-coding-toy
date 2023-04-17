import { attachScopes } from "@rollup/pluginutils";
import { walk } from "estree-walker";
import MagicString from "magic-string";
import { window_names } from "./window_names.js";

/**
 * Returns a Vite plugin that transforms global-mode P5 scripts into modules
 * that export an instance-mode function. It also allows for a simple import
 * mechanism using comments.
 *
 * @return {import("vite").Plugin}
 */
export function p5_transform() {
	return {
		name: "cctoy-transform-p5",

		async transform(code, id) {
			if (!id.endsWith("+project.js")) return null;

			/** @type {import('./types').AstNode} */
			const ast = this.parse(code);
			if (is_module(ast)) return null;

			// Analyze the file

			const non_empty_lines = Array.from(code.matchAll(/^.*\S/gm)).map(
				(match) => /** @type {number} */ (match.index)
			);

			const {
				all_declarations,
				top_level_declarations,
				global_references,
				comment_prelude
			} = analysis(code, ast);

			const sketch_parameter = deduped_variable_name(
				"sketch",
				all_declarations
			);

			// Wrap the body of the script in a function
			const magic_string = new MagicString(code);
			magic_string.prependRight(
				comment_prelude.length,
				`export default function (${sketch_parameter}) {\n`
			);
			for (let index of non_empty_lines) {
				if (index >= comment_prelude.length)
					magic_string.appendRight(index, "\t");
			}
			magic_string.trimEnd().append("\n\n");
			for (let declaration of top_level_declarations) {
				magic_string.append(
					`\t${sketch_parameter}.${declaration} = ${declaration}\n`
				);
			}
			magic_string.append("}\n");

			// Test global references to determine if they should be scoped to the
			// P5 instance
			let references_p5 = false;
			for (let reference of global_references) {
				if (window_names.has(reference.name)) continue;
				if (reference.name === "p5") {
					references_p5 = true;
					continue;
				}
				if (reference.type === "Property" && reference.shorthand) {
					magic_string.appendLeft(
						reference.start,
						`${reference.key.name}: ${sketch_parameter}.`
					);
				} else {
					magic_string.appendLeft(reference.start, `${sketch_parameter}.`);
				}
			}

			// Add a P5 import if there are references to `p5`
			if (references_p5) magic_string.prepend(`import p5 from 'p5'\n\n`);

			return {
				code: magic_string.toString(),
				map: magic_string.generateMap({ hires: true }),
				meta: {
					transformed_from_p5: true
				}
			};
		}
	};
}

/**
 * @param {string} code
 * @param {import('./types').AstNode} ast
 */
function analysis(code, ast) {
	const comment_prelude = code.slice(0, ast.body[0]?.start || 0);
	/** @type {Set<string>} */
	const top_level_declarations = new Set();
	/** @type {Set<string>} */
	const all_declarations = new Set();
	/** @type {Set<import('./types').AstNode>} */
	const global_references = new Set();

	let current_scope = attachScopes(ast, "scope");

	/**
	 * @param {import('./types').AstNode} node
	 * @param {string} name
	 */
	function handle_reference(node, name) {
		if (current_scope.contains(name)) return false;

		global_references.add(node);
		return true;
	}

	for (const name in current_scope.declarations) {
		top_level_declarations.add(name);
		all_declarations.add(name);
	}

	walk(ast, {
		/**
		 * @param {import('./types').AstNode} node
		 * @param {import('./types').AstNode} parent
		 */
		enter(node, parent) {
			if (node.scope) {
				current_scope = node.scope;
				for (let name in current_scope.declarations) {
					all_declarations.add(name);
				}
			}

			// special case – shorthand properties. because node.key === node.value,
			// we can't differentiate once we've descended into the node
			if (node.type === "Property" && node.shorthand) {
				const { name } = node.key;
				handle_reference(node, name);
				this.skip();
				return;
			}

			if (is_reference(node, parent)) {
				const handled = handle_reference(node, node.name);
				if (handled) {
					this.skip();
				}
			}
		}
	});

	return {
		all_declarations,
		top_level_declarations,
		global_references,
		comment_prelude
	};
}

/**
 * @param {import('./types').AstNode} node
 * @param {import('./types').AstNode} parent
 * @return {boolean}
 */
function is_reference(node, parent) {
	if (node.type !== "Identifier") return false;

	// if a member expression is computed, bar[foo], both identifiers are references
	// if it's not computed, bar.foo, only the object is a reference
	if (parent.type === "MemberExpression")
		return parent.computed || node === parent.object;

	// disregard the `bar` in { bar: foo }
	if (parent.type === "Property" && node !== parent.value) return false;

	// disregard the `bar` in `class Foo { bar () {...} }`
	if (parent.type === "MethodDefinition") return false;

	// disregard the `bar` in `export { foo as bar }`
	if (parent.type === "ExportSpecifier" && node !== parent.local) return false;

	// disregard the `bar` in `import { bar as foo }`
	if (parent.type === "ImportSpecifier" && node === parent.imported)
		return false;

	// disregard the `foo` in `foo = 100`
	if (parent.type === "AssignmentExpression") return false;

	return true;
}

/**
 * @param {string} desired
 * @param {Set<string>} declarations
 */
function deduped_variable_name(desired, declarations) {
	if (!declarations.has(desired)) return desired;
	let index = 1;
	while (declarations.has(`${desired}$${index}`)) index++;
	return `${desired}$${index}`;
}

export const module_declarations = new Set([
	"ImportDeclaration",
	"ExportNamedDeclaration",
	"ExportDefaultDeclaration",
	"ExportAllDeclaration"
]);

/**
 * Returns whether or not a parsed JavaScript file contains declarations that
 * would cause it to be treated as a module.
 *
 * @param {import("./types").AstNode} ast
 */
export function is_module(ast) {
	for (let node of ast.body) {
		if (module_declarations.has(node.type)) return true;
	}
	return false;
}
