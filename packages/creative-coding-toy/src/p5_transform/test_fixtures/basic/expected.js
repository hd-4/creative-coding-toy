// Code added by the transform goes after comments at the top.
//
//

let sketch;

let img;

function preload() {
	// sketch scope is applied to loadImage
	img = sketch.loadImage("some_image.jpg");
}

function setup() {
	// sketch scope is applied
	sketch.createCanvas(500, 500);
	sketch.noLoop();
}

function draw() {
	// sketch scope is applied
	sketch.background("red");
	sketch.image(img, 0, 0, sketch.width, sketch.height);

	// sketch scope is applied
	sketch.loadPixels();
	sketch.pixels[0] = 1;
	sketch.updatePixels();

	// sketch scope is not applied
	bare_assignment = 100;
	var other_img = img;

	// sketch scope is applied to abc, def
	let w = Math.min(sketch.abc, sketch.def);
	// sketch scope is applied to min, abc, def
	let x = sketch.min(sketch.abc, sketch.def);
	// left as is
	let y = window.some_property;
	// sketch scope is applied to d
	let z = window["abc" + sketch.d];
	// sketch scope is applied to xyz
	const obj = { xyz: sketch.xyz };

	// sketch scope is not applied
	labeled: for (let i = 0; i < 10; i++) {
		break labeled;
		continue labeled;
	}

	// sketch scope is applied outside of loop
	const points = [];
	for (let point of points) {}
	sketch.point(0, 0);
}

function mouseClicked() {
	// sketch scope is not applied
	console.log("Clicked!");
}

class Particle {
	position;
	velocity = 1.0;
}

export default function (sketch$1) {
	sketch$1.img ??= img;
	sketch$1.preload ??= preload;
	sketch$1.setup ??= setup;
	sketch$1.draw ??= draw;
	sketch$1.mouseClicked ??= mouseClicked;
	sketch$1.Particle ??= Particle;
	sketch = sketch$1;
};

export {
	img,
	preload,
	setup,
	draw,
	mouseClicked,
	Particle
};
