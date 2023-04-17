import * as THREE from "three";

export const engine = "three";

export const config = {
	width: 400,
	height: 400
};

export const inputs = {
	cubeColor: "#ff0000"
};

export default function ({ scene, camera, width, height, inputs }) {
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: inputs.cubeColor });
	const cube = new THREE.Mesh(geometry, material);
	cube.rotation.x += 0.5;
	cube.rotation.y += 0.5;

	scene.add(cube);

	camera.position.z = 2;
}
