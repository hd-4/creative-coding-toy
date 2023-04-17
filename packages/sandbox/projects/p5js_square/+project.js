export const engine = "p5";

export const inputs = {
	numeral: { value: 100, min: 0, max: 255, step: 1 }
};

export default function sketch(p) {
	p.setup = () => {
		p.createCanvas(200, 200);
		p.background(p.inputs.numeral ?? 0);
	};
}
