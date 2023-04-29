import path from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import * as vite from "vite";

import { handler } from "ui";
import { generate_manifest } from "../../sync/index.js";
import { runtime_base, runtime_directory } from "./utils.js";
import { p5_transform } from "./p5_transform.js";

const cwd = process.cwd();

/** @returns {import("vite").Plugin[]} */
export function creative_coding_toy() {
	return [...svelte(), p5_transform(), hmr(), main()];
}

/** @returns {import("vite").Plugin} */
function main() {
	/** @type {string} */
	let project_base;

	return {
		name: "creative-coding-toy",

		config() {
			return {
				appType: "custom",
				server: {
					fs: {
						allow: [
							runtime_directory, // TODO: why do I need this and SvelteKit doesn't?
							path.resolve("projects"),
							path.resolve("node_modules"),
							path.resolve(vite.searchForWorkspaceRoot(cwd), "node_modules")
						]
					}
				},
				build: {
					rollupOptions: {
						input: `${runtime_directory}/host.js`
					}
				}
			};
		},

		configResolved(config) {
			project_base = path.join(config.root, "projects");
		},

		configureServer(server) {
			/** @type {import("ui").ServerManifest} */
			let manifest;

			function update_manifest() {
				const { collections, projects } = generate_manifest(project_base);
				manifest = {
					start_url: `${runtime_base}/host.js`,
					projects: projects.map((p) => ({
						id: p.id,
						name: p.name,
						filetype: p.file.slice(p.file.lastIndexOf(".") + 1),
						import_path: `/projects/${p.file}`,
						collection: p.collection,
						parent: p.parent,
						children: p.children,
						async preload() {
							await server.transformRequest(this.import_path);
							const id = (
								await server.pluginContainer.resolveId(this.import_path)
							)?.id;
							if (!id) return {};

							const info = server.pluginContainer.getModuleInfo(id);
							return {
								transformed_from_p5: info?.meta?.transformed_from_p5
							};
						}
					})),
					collections: collections.map((c) => ({
						id: c.id,
						name: c.name,
						projects: c.projects
					}))
				};
				server.ws.send({ type: "custom", event: "manifest-updated" });
			}

			/**
			 * @param {string} event
			 * @param {(file: string) => void} callback
			 */
			function watch(event, callback) {
				server.watcher.on(event, (file) => {
					if (file.startsWith(project_base + path.sep)) {
						callback(file);
					}
				});
			}

			/** @type {NodeJS.Timeout | null} */
			let timeout = null;

			/** @param {() => void} f */
			const debounce = (f) => {
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(() => {
					timeout = null;
					f();
				}, 100);
			};

			watch("add", () => debounce(update_manifest));
			watch("unlink", () => debounce(update_manifest));

			update_manifest();

			return () => {
				server.middlewares.use((req, _res, next) => {
					/** @type {any} */ (req).cctoy_meta = {
						manifest
					};
					next();
				});
				server.middlewares.use(
					/** @type {import("vite").Connect.HandleFunction} */ (handler)
				);
			};
		}
	};
}

/** @returns {import("vite").Plugin} */
function hmr() {
	return {
		name: "cctoy-hmr",

		async transform(code, id) {
			// Filter modules
			if (!id.endsWith("+project.js")) return null;

			const host_import = JSON.stringify(`${runtime_base}/host.js`);

			code = code.trimEnd();
			code =
				code +
				"\n\n" +
				`import * as $$host from ${host_import};
if (import.meta.hot) {
  $$host.register_project_hmr(${JSON.stringify(id)});
  import.meta.hot.accept((mod) => {
    $$host.update_project(${JSON.stringify(id)}, mod);
  });
}`.replace(/\n+/g, "");

			return {
				code
			};
		}
	};
}
