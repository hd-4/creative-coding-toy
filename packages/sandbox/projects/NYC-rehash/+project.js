import image from "./nyc.jpg";

export const engine = "p5";

export const inputs = {
	threshold: {
		value: 0.5,
		min: 0,
		max: 1
	}
};

export default function (p) {
	let img;

	function writeColor(image, x, y, red, green, blue, alpha) {
		let index = (x + y * image.width) * 4;
		image.pixels[index] = red;
		image.pixels[index + 1] = green;
		image.pixels[index + 2] = blue;
		image.pixels[index + 3] = alpha;
	}

	p.preload = () => {
		img = p.loadImage(image);
	};

	p.setup = () => {
		p.createCanvas(800, 600);

		img.loadPixels();
		for (let y = 0; y < img.height; y++) {
			for (let x = 0; x < img.width; x++) {
				if (p.random() < p.inputs.threshold) continue;

				let red = p.random(255);
				let green = p.random(255);
				let blue = p.random(255);
				let alpha = 255;
				writeColor(img, x, y, red, green, blue, alpha);
			}
		}
		img.updatePixels();

		p.image(img, 0, 0, p.width, p.height);
	};
}
