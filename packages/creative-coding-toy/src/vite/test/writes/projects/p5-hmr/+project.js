// @ts-nocheck

const input_config = {
	value_a: "foo"
};

function setup() {
	console.log("[test] p5 lifecycle", "setup");

	noLoop();
}

function draw() {
	console.log("[test] p5 lifecycle", "draw");
}
