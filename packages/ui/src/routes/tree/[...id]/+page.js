import { browser } from '$app/environment';
import { import_host } from '$lib/import_host.js';

/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
	if (!browser) return { ...data, engine: null, project_module: null };

	const host = await import_host();
	const project_module = await host.load_project(data.project_import_path);
	const engine = await host.get_engine(data.traits, project_module);

	return {
		...data,
		project_module,
		engine
	};
}
