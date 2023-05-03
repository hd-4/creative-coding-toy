function setup() {
	// force conflicts with the sketch variable name
	let sketch = null;
	let sketch$1 = null;
}

function draw() {
	// left as is
	var q = Math.min(1, 2);

	// sketch scope is applied
	background(0, 0, 0);

	// sketch scope is applied to sketch
	console.log(sketch);

	// left as is
	window.foobar();

	// left as is
	window["abc" + q];
}
