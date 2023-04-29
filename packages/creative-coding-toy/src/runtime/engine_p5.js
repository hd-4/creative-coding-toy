// @ts-expect-error (p5 doesn't have types)
import p5 from "p5";
import { live_inputs } from "./utils";

/**
 * @template {object} Inputs
 * @param {any} mod
 * @param {HTMLElement} element
 * @param {{inputs?: Inputs} | undefined} options
 */
export function mount(mod, element, options = {}) {
	/** @type {any} */
	let p5_instance;

	const inputs = live_inputs(options.inputs ?? {});

	/**
	 * @param {any} sketch
	 */
	function sketch_wrapper(sketch) {
		mod.default(sketch);
		sketch.preload = p5_method_wrapper(inputs, "preload", sketch.preload);
		sketch.setup = p5_method_wrapper(inputs, "setup", sketch.setup);
		sketch.draw = p5_method_wrapper(inputs, "draw", sketch.draw);
		sketch.inputs = inputs.proxy;
		p5_instance = sketch;
	}

	let sketch_instance = new p5(sketch_wrapper, element);

	return {
		/**
		 * @param {Partial<Inputs>} new_inputs
		 */
		update_inputs(new_inputs) {
			const affected_spans = inputs.update(new_inputs);
			if (affected_spans.has("preload") || affected_spans.has("setup")) {
				sketch_instance.remove();
				sketch_instance = new p5(sketch_wrapper, element);
			} else if (affected_spans.has("draw")) {
				p5_instance.redraw();
			}
		},

		destroy() {
			sketch_instance.remove();
		}
	};
}

/**
 * @template {object} T
 * @param {import("./types").LiveInputs<T>} inputs
 * @param {string} span_name
 * @param {() => void} original
 */
function p5_method_wrapper(inputs, span_name, original) {
	return () => {
		inputs.start_span(span_name);
		try {
			original?.();
		} finally {
			inputs.end_span();
		}
	};
}
