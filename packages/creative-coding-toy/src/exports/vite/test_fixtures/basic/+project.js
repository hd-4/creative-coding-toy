let img;

function preload() {
	img = loadImage("some_image.jpg");
}

function setup() {
	createCanvas(500, 500);
	noLoop();
}

function draw() {
	background("red");
	image(img, 0, 0, width, height);
}

function mouseClicked() {
	console.log("Clicked!");
}
