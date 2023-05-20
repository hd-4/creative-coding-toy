export const engine = "canvas";

export const config = {
	size: [600, 400]
};

export const input_config = {
	value_a: "foo"
};

export default function ({ canvas, context, inputs }) {
	console.log("[test] canvas lifecycle", "setup");

	return () => {
		console.log("[test] canvas lifecycle", "draw");
	};
}
