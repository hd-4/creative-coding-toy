import * as THREE from "three";

export interface CanvasProjectModule {
	config: CanvasConfig;

	default: (props: {
		context: CanvasRenderingContext2D;
		width: number;
		height: number;
		inputs: unknown;
	}) => void;
}

export interface CanvasConfig {
	width: number;
	height: number;
}

export interface ThreeJSProjectModule {
	config: ThreeJSConfig;

	default: (props: {
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.Renderer;
		width: number;
		height: number;
		inputs: unknown;
	}) => void;
}

export interface ThreeJSConfig {
	width: number;
	height: number;
}
