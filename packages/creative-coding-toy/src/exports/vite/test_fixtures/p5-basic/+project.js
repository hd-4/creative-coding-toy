let img;

function preload() {
	// sketch scope is applied to loadImage
	img = loadImage("some_image.jpg");
}

function setup() {
	// sketch scope is applied
	createCanvas(500, 500);
	noLoop();
}

function draw() {
	// sketch scope is applied
	background("red");
	image(img, 0, 0, width, height);

	// sketch scope is applied
	loadPixels();
	pixels[0] = 1;
	updatePixels();

	// sketch scope is not applied
	bare_assignment = 100;
	var other_img = img;

	// sketch scope is applied to abc, def
	let w = Math.min(abc, def);
	// sketch scope is applied to min, abc, def
	let x = min(abc, def);
	// left as is
	let y = window.some_property;
	// sketch scope is applied to d
	let z = window["abc" + d];
	// sketch scope is applied to xyz
	const obj = { xyz };
}

function mouseClicked() {
	// sketch scope is not applied
	console.log("Clicked!");
}
