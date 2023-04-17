// @ts-expect-error (p5 doesn't have types)
import p5 from "p5";

/**
 * @param {any} mod
 * @param {HTMLElement} element
 */
export function mount(mod, element, { inputs = {} } = {}) {
	/**
	 * @param {any} p
	 */
	function p5_wrapper(p) {
		p.inputs = inputs;
		mod.default(p);
	}

	let instance = new p5(p5_wrapper, element);

	return {
		update_inputs(new_inputs) {
			inputs = new_inputs;
			instance.remove();
			instance = new p5(p5_wrapper, element);
		},

		destroy() {
			instance.remove();
		}
	};
}
