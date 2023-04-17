import { Middleware } from 'polka';

export const handler: Middleware;

export interface ServerManifest {
	start_url: string;
	projects: ProjectData[];
	collections: CollectionData[];
}

export interface ProjectData {
	id: string;
	name: string;
	filetype: string;
	import_path: string;

	collection: number | null;
	parent: number | null;
	children: number[];

	preload(): Promise<PreloadAnalysis>;
}

export interface CollectionData {
	id: string;
	name: string;

	projects: number[];
}

export interface PreloadAnalysis {
	transformed_from_p5?: boolean;
}
