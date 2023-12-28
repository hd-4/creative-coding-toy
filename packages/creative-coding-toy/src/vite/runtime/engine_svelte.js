/**
 * @param {{default: import("svelte").ComponentType}} mod
 * @param {HTMLElement} element
 * @param {{inputs?: any} | undefined} options
 */
export function mount(mod, element, options = {}) {
	const inputs = structuredClone(options.inputs);

	const instance = new mod.default({
		target: element,
		props: {
			inputs
		}
	});

	return {
		/**
		 * @param {any} new_inputs
		 */
		update_inputs(new_inputs) {
			if (!inputs) return;
			for (const key of Object.keys(new_inputs)) {
				inputs[key] = new_inputs[key];
			}
			instance.$set({ inputs });
		},

		destroy() {
			instance.$destroy();
		}
	};
}
