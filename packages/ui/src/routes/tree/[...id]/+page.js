import { browser } from '$app/environment';
import { import_runtime } from '$lib/import_runtime.js';

/** @type {import('./$types').PageLoad} */
export async function load({ data }) {
	if (!browser) return { ...data, engine: null, project_module: null };
	if (!data.preload_result.successful) {
		return { ...data, engine: null, project_module: null };
	}

	const traits = {
		filetype: data.filetype,
		transformed_from_p5: data.preload_result.transformed_from_p5
	};

	const { host } = await import_runtime();
	const project_module = await host.load_project(data.project_import_path);
	const engine = await host.get_engine(traits, project_module);

	return {
		...data,
		project_module,
		engine
	};
}
