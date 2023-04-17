export interface Manifest {
	projects: Project[];
	collections: Collection[];
}

export interface Project {
	id: string;
	name: string;
	file: string;
	depth: number;

	parent_collection: Collection | null;
	parent_project: Project | null;

	collection: number | null;
	parent: number | null;
	children: number[];
}

export interface Collection {
	id: string;
	name: string;
	empty: boolean;

	projects: number[];
}
