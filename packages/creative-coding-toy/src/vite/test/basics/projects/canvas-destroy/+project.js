export const engine = "canvas";

export const config = {
	size: [600, 400]
};

export const input_config = {
	used_in_setup: "foo",
	used_in_draw: "foo",
	unused: "foo"
};

export default function ({ canvas, context, inputs, onDestroy }) {
	console.log("[test] canvas lifecycle", "setup");
	const x = inputs.used_in_setup;

	onDestroy(() => {
		console.log("[test] canvas lifecycle", "destroy");
	});

	return () => {
		console.log("[test] canvas lifecycle", "draw");

		const y = inputs.used_in_draw;
	};
}
