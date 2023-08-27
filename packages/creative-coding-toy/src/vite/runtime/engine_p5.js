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
		p5_instance = sketch;

		mod.default(sketch);
		sketch.preload = p5_method_wrapper(inputs, "preload", sketch.preload);
		sketch.setup = p5_method_wrapper(inputs, "setup", sketch.setup);
		sketch.draw = p5_method_wrapper(inputs, "draw", sketch.draw);
		sketch.inputs = inputs.proxy;
	}

	// p5's constructor calls the setup() and draw() methods before returning,
	// which means an exception will stop it from returning an instance.
	// Instead, capture the instance in the sketch wrapper and call the
	// constructor without an assignment.
	function mount_and_catch_errors() {
		try {
			new p5(sketch_wrapper, element);
		} catch (e) {
			console.error(e);
		}
	}

	mount_and_catch_errors();

	return {
		/**
		 * @param {Partial<Inputs>} new_inputs
		 */
		update_inputs(new_inputs) {
			const affected_spans = inputs.update(new_inputs);
			if (affected_spans.has("preload") || affected_spans.has("setup")) {
				p5_instance.remove();
				mount_and_catch_errors();
			} else if (affected_spans.has("draw")) {
				p5_instance.redraw();
			}
		},

		destroy() {
			p5_instance.remove();
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
