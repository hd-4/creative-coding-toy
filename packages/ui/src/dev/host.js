export class Host {
	add_manifest_listener() {
		// Stub for running in dev
		return { remove() {} };
	}

	/**
	 * @param {string} path
	 */
	async load_project(path) {
		return await import(/* @vite-ignore */ path);
	}

	add_project_listener() {
		// Stub for running in dev
		return { remove() {} };
	}

	async get_engine() {
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
					const project_element = document.createElement('div');
					project_element.style.width = '300px';
					project_element.style.height = '300px';
					project_element.style.border = '1px solid black';
					project_element.textContent = 'mounted ' + Math.round(Math.random() * 10000 + 1000);
					container.appendChild(project_element);
					return {
						destroy() {
							console.log('[Dev] Destroying project');
							container.removeChild(project_element);
						},
						update_inputs(inputs) {
							console.log('[Dev] New inputs', inputs);
						}
					};
				}
			}
		};
	}
}
