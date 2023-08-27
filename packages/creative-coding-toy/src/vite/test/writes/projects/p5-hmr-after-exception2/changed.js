// @ts-nocheck

function setup() {
	console.log("[test] p5 lifecycle", "setup");

	createCanvas(200, 200);
	noLoop();
}

function draw() {
	console.log("[test] p5 lifecycle", "draw");

	throw new Error("something went wrong!");
}
