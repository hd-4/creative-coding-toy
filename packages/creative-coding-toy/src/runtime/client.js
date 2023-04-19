export function start() {
	// TODO: does this function even need to exist

	// Vite looks for this if statement to initialize its client connection.
	if (import.meta.hot) {
	}
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
