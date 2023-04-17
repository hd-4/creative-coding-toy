/**
 * @param {{default: import("svelte").ComponentType}} mod
 * @param {HTMLElement} element
 */
export function mount(mod, element, { inputs = {} } = {}) {
	const instance = new mod.default({
		target: element,
		props: {
			inputs
		}
	});

	return {
		update_inputs(new_inputs) {
			instance.$set({ inputs: new_inputs });
		},

		destroy() {
			instance.$destroy();
		}
	};
}
