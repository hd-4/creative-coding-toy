// @ts-nocheck

let draw_count;

function setup() {
	noLoop();

	draw_count = 0;
	update({ draw_count });
}

function draw() {
	draw_count++;
	update({ draw_count });
}

function update(values) {
	window.TEST_OUTPUT = {
		updated: Date.now(),
		values: {
			...(window.TEST_OUTPUT?.values ?? {}),
			...values
		}
	};
}
