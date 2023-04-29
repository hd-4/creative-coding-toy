// @ts-expect-error (p5 doesn't have types)
import p5 from "p5";

/**
 * @param {any} mod
 * @param {HTMLElement} element
 * @param {{inputs?: any} | undefined} options
 */
export function mount(mod, element, options = {}) {
	/** @type {any} */
	let p5_instance;

	const inputs = input_wrapper(options.inputs ?? {});

	/**
	 * @param {any} sketch
	 */
	function sketch_wrapper(sketch) {
		mod.default(sketch);

		const original_preload = sketch.preload;
		sketch.preload = () => {
			inputs.start_span("preload");
			original_preload?.();
			inputs.end_span();
		};

		const original_setup = sketch.setup;
		sketch.setup = () => {
			inputs.start_span("setup");
			original_setup?.();
			inputs.end_span();
		};

		const original_draw = sketch.draw;
		sketch.draw = () => {
			inputs.start_span("draw");
			original_draw?.();
			inputs.end_span();
		};

		p5_instance = sketch;
	}

	let sketch_instance = new p5(sketch_wrapper, element);
	p5_instance.inputs = inputs.values;

	return {
		update_inputs(new_inputs) {
			const affected_spans = inputs.update(new_inputs);
			if (affected_spans.has("preload") || affected_spans.has("setup")) {
				sketch_instance.remove();
				sketch_instance = new p5(sketch_wrapper, element);
				p5_instance.inputs = inputs.values;
			} else if (affected_spans.has("draw")) {
				p5_instance.redraw();
			}
		},

		destroy() {
			sketch_instance.remove();
		}
	};
}

function input_wrapper(inputs) {
	let underlying_values = inputs;
	/** @type {Map<string, Set<string | symbol>>} */
	const uses = new Map();
	/** @type {string | null} */
	let current_span = null;

	const accessor = new Proxy(/** @type {any} */ ({}), {
		get(_target, property, _receiver) {
			if (current_span) uses.get(current_span)?.add(property);
			return Reflect.get(underlying_values, property, underlying_values);
		}
	});

	return {
		values: accessor,

		/**
		 * @param {string} name
		 */
		start_span(name) {
			uses.set(name, new Set());
			current_span = name;
		},

		end_span() {
			current_span = null;
		},

		/**
		 * @param {*} new_values
		 */
		update(new_values) {
			underlying_values = { ...underlying_values, ...new_values };
			/** @type {Set<string>} */
			const affected_spans = new Set();
			for (const input of Object.keys(new_values)) {
				for (const [span_name, inputs] of uses) {
					if (inputs.has(input)) affected_spans.add(span_name);
				}
			}
			return affected_spans;
		}
	};
}
