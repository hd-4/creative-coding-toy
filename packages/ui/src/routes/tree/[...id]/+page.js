import { browser } from '$app/environment';

/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
	if (!browser) return { ...data, engine: null, project_module: null };

	const [host, project_module] = await Promise.all([
		import(/* @vite-ignore */ data.runtime_import_path),
		import(/* @vite-ignore */ data.project_import_path)
	]);
	const engine = await host.get_engine(data.traits, project_module);

	return {
		...data,
		engine,
		project_module
	};
}
