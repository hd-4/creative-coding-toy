// @ts-nocheck

const input_config = {
	used_in_preload: "foo",
	used_in_setup: "foo",
	used_in_draw: "foo",
	unused: "foo"
};

function preload() {
	console.log("[test] p5 lifecycle", "preload");

	const x = inputs.used_in_preload;
}

function setup() {
	console.log("[test] p5 lifecycle", "setup");

	noLoop();
	const x = inputs.used_in_setup;
}

function draw() {
	console.log("[test] p5 lifecycle", "draw");

	const x = inputs.used_in_draw;
}
