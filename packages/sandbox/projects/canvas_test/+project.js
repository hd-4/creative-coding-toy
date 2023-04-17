export const engine = "canvas";

export const config = {
	width: 400,
	height: 400
};

export const inputs = {
	background: "#ffffff"
};

export default function ({ context, width, height, inputs }) {
	context.fillStyle = inputs.background;
	context.fillRect(0, 0, width, height);

	context.fillStyle = "rgb(200, 0, 0)";
	context.fillRect(10, 10, width - 20, height - 20);
}
