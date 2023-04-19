export function start() {
	if (import.meta.hot) {
		import.meta.hot.on("manifest-updated", () => {
			for (let listener of manifest_listeners) {
				listener();
			}
		});
	}
}

/** @type {Set<() => void>} */
const manifest_listeners = new Set();

/**
 * @param {() => void} callback
 */
export function add_manifest_listener(callback) {
	manifest_listeners.add(callback);
	return {
		remove() {
			manifest_listeners.delete(callback);
		}
	};
}

/**
 * @param {{ filetype: string, transformed_from_p5?: boolean }} traits
 * @param {{ engine?: string; }} project_module
 */
export async function get_engine(traits, project_module) {
	const engine_name = traits.transformed_from_p5
		? "p5"
		: traits.filetype === "svelte"
		? "svelte"
		: project_module.engine;
	try {
		return {
			name: engine_name,
			mod: await import(`./engine_${engine_name}.js`)
		};
	} catch {}
	return { name: engine_name, mod: null };
}

/**
 * Hack: TypeScript won't pick up the Vite client types unless a file that
 * references them is imported. There isn't any logic in this file, so just use the import.
 *
 * @type {import("creative-coding-toy")}
 */
