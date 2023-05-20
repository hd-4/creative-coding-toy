import * as THREE from "three";

export interface CanvasProjectModule {
	config: CanvasConfig;
	default: CanvasSetup;
}

export interface CanvasConfig {
	size: [width: number, height: number];
}

type CanvasSetup = (props: {
	context: CanvasRenderingContext2D;
	width: number;
	height: number;
	inputs: unknown;
}) => CanvasDraw;

type CanvasDraw = (props: {}) => void;

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

export interface LiveInputs<T extends object> {
	proxy: T;
	start_span(name: string): void;
	end_span(): void;
	update(changes: Partial<T>): Set<string>;
}
