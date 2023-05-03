let sketch$2;

function setup() {
	// force conflicts with the sketch variable name
	let sketch = null;
	let sketch$1 = null;
}

function draw() {
	// left as is
	var q = Math.min(1, 2);

	// sketch scope is applied
	sketch$2.background(0, 0, 0);

	// sketch scope is applied to sketch
	console.log(sketch$2.sketch);

	// left as is
	window.foobar();

	// left as is
	window["abc" + q];
}

export default function (sketch$3) {
	sketch$3.setup = setup;
	sketch$3.draw = draw;
	sketch$2 = sketch$3;
};

export {
	setup,
	draw
};
