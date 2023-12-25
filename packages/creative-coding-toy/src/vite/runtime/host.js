export class Host {
	/** @type {Set<() => void>} */
	manifest_listeners = new Set();

	/** @type {Map<string, string>} */
	project_paths_by_id = new Map();

	/** @type {Map<string, any>} */
	loaded_projects = new Map();

	/** @type {Map<string, () => void>} */
	project_listeners = new Map();

	/** @type {((id: string) => void) | undefined} */
	registration_callback;

	/**
	 * @param {() => void} callback
	 */
	add_manifest_listener(callback) {
		this.manifest_listeners.add(callback);
		return {
			remove: () => {
				this.manifest_listeners.delete(callback);
			}
		};
	}

	notify_manifest_listeners() {
		for (let listener of this.manifest_listeners) {
			listener();
		}
	}

	/**
	 * @param {string} path
	 */
	async load_project(path) {
		if (this.loaded_projects.has(path)) return this.loaded_projects.get(path);

		/** @type {string | undefined} */
		let loaded_id = undefined;
		this.registration_callback = (id) => {
			loaded_id = id;
		};

		let mod;
		try {
			mod = await import(/* @vite-ignore */ path);
		} catch {
			mod = null;
		}

		if (!loaded_id) return mod;
		this.project_paths_by_id.set(loaded_id, path);
		this.loaded_projects.set(path, mod);
		return mod;
	}

	/**
	 * @param {string} path
	 * @param {() => void} callback
	 */
	add_project_listener(path, callback) {
		this.project_listeners.set(path, callback);
		return {
			remove: () => {
				this.project_listeners.delete(path);
			}
		};
	}

	/**
	 * @param {string} id
	 */
	register_project_hmr(id) {
		this.registration_callback?.(id);
	}

	/**
	 * @param {string} id
	 * @param {any} mod
	 */
	update_project(id, mod) {
		const path = this.project_paths_by_id.get(id);
		if (!path) throw new Error("Can't find HMR path for project");
		this.loaded_projects.set(path, mod);
		this.project_listeners.get(path)?.();
	}

	/**
	 * @param {{ filetype: string, transformed_from_p5?: boolean }} traits
	 * @param {{ engine?: string; }} project_module
	 */
	async get_engine(traits, project_module) {
		if (!project_module) return { name: "none", mod: null };

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
		} catch {
			return { name: engine_name, mod: null };
		}
	}
}
