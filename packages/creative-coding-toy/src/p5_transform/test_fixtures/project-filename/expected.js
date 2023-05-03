let sketch;

function setup() {
	sketch.createCanvas(500, 500);
}

export default function (sketch$1) {
	sketch$1.setup = setup;
	sketch = sketch$1;
};

export {
	setup
};
