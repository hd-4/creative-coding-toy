/**
 * @param {import("./types").CanvasProjectModule} mod
 * @param {HTMLElement} element
 */
export function mount(mod, element, { inputs = {} } = {}) {
	const canvas = document.createElement("canvas");
	canvas.width = mod.config.width;
	canvas.height = mod.config.height;
	element.appendChild(canvas);

	const context = canvas.getContext("2d");
	if (!context) throw new Error("The canvas returned an undefined context.");

	function render() {
		mod.default({
			context: /** @type {CanvasRenderingContext2D} */ (context),
			width: mod.config.width,
			height: mod.config.height,
			inputs
		});
	}

	render();

	return {
		update_inputs(new_inputs) {
			inputs = new_inputs;
			render();
		},

		destroy() {
			element.removeChild(canvas);
		}
	};
}
