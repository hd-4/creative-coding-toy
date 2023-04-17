export interface ProjectTileData {
	name: string;
	link: string;
	filetype: string;
	associated: number;
}

export interface CollectionData {
	name: string;
	projects: ProjectTileData[];
}
