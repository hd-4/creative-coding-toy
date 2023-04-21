import { browser } from '$app/environment';

/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
	if (!browser) return { ...data, client: null, engine: null, project_module: null };

	const client = await import(/* @vite-ignore */ data.runtime_import_path);
	const project_module = await client.load_project(data.project_import_path);
	const engine = await client.get_engine(data.traits, project_module);

	return {
		...data,
		client,
		project_module,
		engine
	};
}
