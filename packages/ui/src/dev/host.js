export function add_manifest_listener() {
	// Stub for running in dev
	return { remove() {} };
}

/**
 * @param {string} path
 */
export async function load_project(path) {
	return await import(/* @vite-ignore */ path);
}

export function add_project_listener() {
	// Stub for running in dev
	return { remove() {} };
}

export async function get_engine() {
	return {
		name: 'test',
		mod: {
			/**
			 * @param {any} _project
			 * @param {HTMLElement} container
			 * @param {{ inputs: any; }} options
			 */
			mount(_project, container, options) {
				console.log('[Dev] Mounting project', options?.inputs);
				container.style.width = '300px';
				container.style.height = '300px';
				container.style.border = '1px solid black';
				container.textContent = 'mounted ' + Math.round(Math.random() * 10000 + 1000);
				return {
					destroy() {
						console.log('[Dev] Destroying project');
					},
					update_inputs(inputs) {
						console.log('[Dev] New inputs', inputs);
					}
				};
			}
		}
	};
}
