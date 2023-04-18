let sketch;

let img;

function preload() {
	img = sketch.loadImage("some_image.jpg");
}

function setup() {
	sketch.createCanvas(500, 500);
	sketch.noLoop();
}

function draw() {
	sketch.background("red");
	sketch.image(img, 0, 0, sketch.width, sketch.height);
}

export default function (sketch$1) {
	sketch$1.img = img;
	sketch$1.preload = preload;
	sketch$1.setup = setup;
	sketch$1.draw = draw;
};

export {
	img,
	preload,
	setup,
	draw
};
