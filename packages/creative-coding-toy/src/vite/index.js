import path from "node:path";
import * as vite from "vite";

import { handler } from "ui";
import { generate_manifest } from "../sync/index.js";
import { runtime_base, runtime_directory } from "./utils.js";
import { p5_transform } from "../p5_transform/index.js";

const cwd = process.cwd();
const runtime_entry_fs_path = `${runtime_directory}/index.js`;
const runtime_entry_browser_path = `${runtime_base}/index.js`;

/** @returns {import("vite").Plugin[]} */
export function creative_coding_toy() {
	return [
		p5_transform({
			include: "**/+project.js"
		}),
		hmr(),
		main()
	];
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
						input: runtime_entry_fs_path
					}
				}
			};
		},

		configResolved(config) {
			project_base = path.join(config.root, "projects");

			const svelte = config.plugins.find(
				(p) => p.name === "vite-plugin-svelte"
			);
			if (svelte?.api.options.hot) {
				throw new Error("Please turn off Svelte HMR.");
			}
		},

		configureServer(server) {
			/** @type {import("ui").ServerManifest} */
			let manifest;

			function update_manifest() {
				const { collections, projects } = generate_manifest(project_base);
				manifest = {
					start_url: runtime_entry_browser_path,
					projects: projects.map((p) => ({
						id: p.id,
						name: p.name,
						filetype: p.file.slice(p.file.lastIndexOf(".") + 1),
						import_path: `/projects/${p.file}`,
						collection: p.collection,
						parent: p.parent,
						children: p.children,
						async preload() {
							try {
								await server.transformRequest(this.import_path);
							} catch {
								return { successful: false };
							}

							const id = (
								await server.pluginContainer.resolveId(this.import_path)
							)?.id;
							if (!id) return { successful: false };

							const info = server.pluginContainer.getModuleInfo(id);
							return {
								successful: true,
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
				server.middlewares.use((req, res, next) => {
					// @ts-ignore
					req.cctoy_meta = { manifest };
					// @ts-ignore
					handler(req, res, next);
				});
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
			if (!id.endsWith("+project.js") && !id.endsWith("+project.svelte"))
				return null;

			code = code.trimEnd();
			code =
				code +
				"\n\n" +
				`import {host as $$host} from ${JSON.stringify(
					runtime_entry_browser_path
				)};
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
