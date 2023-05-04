import * as THREE from "three";

/**
 * @param {import("./types").ThreeJSProjectModule} mod
 * @param {HTMLElement} element
 */
export function mount(mod, element, { inputs = {} } = {}) {
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(mod.config.width, mod.config.height);
	element.appendChild(renderer.domElement);

	function render() {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			mod.config.width / mod.config.height,
			0.1,
			1000
		);
		mod.default({
			scene,
			camera,
			renderer,
			width: mod.config.width,
			height: mod.config.height,
			inputs
		});
		renderer.render(scene, camera);
	}

	render();

	return {
		update_inputs(new_inputs) {
			inputs = new_inputs;
			render();
		},

		destroy() {
			element.removeChild(renderer.domElement);
		}
	};
}
