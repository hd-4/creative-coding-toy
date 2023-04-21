import { browser } from '$app/environment';
import { import_client } from '$lib/import_client.js';

/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
	if (!browser) return { ...data, engine: null, project_module: null };

	const client = await import_client();
	const project_module = await client.load_project(data.project_import_path);
	const engine = await client.get_engine(data.traits, project_module);

	return {
		...data,
		project_module,
		engine
	};
}
