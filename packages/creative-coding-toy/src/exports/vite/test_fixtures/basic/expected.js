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

function mouseClicked() {
	console.log("Clicked!");
}

export default function (sketch$1) {
	sketch$1.img = img;
	sketch$1.preload = preload;
	sketch$1.setup = setup;
	sketch$1.draw = draw;
	sketch$1.mouseClicked = mouseClicked;
	sketch = sketch$1;
};

export {
	img,
	preload,
	setup,
	draw,
	mouseClicked
};
