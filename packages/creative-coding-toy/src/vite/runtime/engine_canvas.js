import { live_inputs } from "./utils.js";

/**
 * @template {object} Inputs
 * @param {import("./types").CanvasProjectModule} mod
 * @param {HTMLElement} element
 * @param {{inputs?: Inputs} | undefined} options
 */
export function mount(mod, element, options = {}) {
	const inputs = live_inputs(options.inputs ?? {});

	/** @type {HTMLCanvasElement} */
	let canvas;
	/** @type {CanvasRenderingContext2D} */
	let context;
	/** @type {import("./types").CanvasDraw} */
	let draw;

	function setup() {
		canvas = document.createElement("canvas");
		canvas.width = mod.config.size[0];
		canvas.height = mod.config.size[1];
		element.appendChild(canvas);

		const context_2d = canvas.getContext("2d");
		if (!context_2d)
			throw new Error("The canvas returned an undefined context.");
		context = context_2d;

		inputs.start_span("setup");
		draw = mod.default({
			context: context,
			width: mod.config.size[0],
			height: mod.config.size[1],
			inputs: inputs.proxy
		});
		inputs.end_span();

		draw_frame();
	}

	function draw_frame() {
		inputs.start_span("draw");
		draw({});
		inputs.end_span();
	}

	function remove() {
		element.removeChild(canvas);
	}

	setup();

	return {
		/**
		 * @param {Partial<Inputs>} new_inputs
		 */
		update_inputs(new_inputs) {
			const affected_spans = inputs.update(new_inputs);
			if (affected_spans.has("setup")) {
				remove();
				setup();
			} else if (affected_spans.has("draw")) {
				draw_frame();
			}
		},

		destroy() {
			remove();
		}
	};
}
