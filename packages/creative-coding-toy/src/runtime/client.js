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

/** @type {Map<string, string>} */
const project_paths_by_id = new Map();

/** @type {Map<string, any>} */
const loaded_projects = new Map();

/** @type {Map<string, () => void>} */
const project_listeners = new Map();

/** @type {(id: string) => void} */
let registration_callback;

/**
 * @param {string} path
 */
export async function load_project(path) {
	if (loaded_projects.has(path)) return loaded_projects.get(path);

	/** @type {string | undefined} */
	let loaded_id = undefined;
	registration_callback = (id) => {
		loaded_id = id;
	};
	const mod = await import(/* @vite-ignore */ path);
	if (!loaded_id) return mod;
	project_paths_by_id.set(loaded_id, path);
	loaded_projects.set(path, mod);
	return mod;
}

/**
 * @param {string} path
 * @param {() => void} callback
 */
export function add_project_listener(path, callback) {
	project_listeners.set(path, callback);
	return {
		remove() {
			project_listeners.delete(path);
		}
	};
}

/**
 * @param {string} id
 */
export function register_project_hmr(id) {
	registration_callback?.(id);
}

/**
 * @param {string} id
 * @param {any} mod
 */
export function update_project(id, mod) {
	const path = project_paths_by_id.get(id);
	if (!path) throw new Error("Can't find HMR path for project");
	loaded_projects.set(path, mod);
	project_listeners.get(path)?.();
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
