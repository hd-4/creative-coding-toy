import p5 from '/resolved/path/to/p5.js';

let sketch;

function setup() {}

function draw() {
	const v = new p5.Vector(1, 1);
}

export default function (sketch$1) {
	sketch$1.setup = setup;
	sketch$1.draw = draw;
	sketch = sketch$1;
};

export {
	setup,
	draw
};
