import { error } from '@sveltejs/kit';

/** @type {import("./$types").PageServerLoad} */
export function load({ platform }) {
	if (!platform) error(503);

	const { projects, collections } = platform.req.cctoy_meta.manifest;

	/** @type {import("./types").ProjectTileData[]} */
	const on_deck = [];
	for (const project of projects) {
		if (project.collection !== null || project.parent !== null) continue;
		on_deck.push({
			name: project.name,
			link: `/tree/${project.id}`,
			filetype: project.filetype,
			associated: project.children.length
		});
	}

	/** @type {import("./types").CollectionData[]} */
	const aside = [];
	for (const collection of collections) {
		/** @type {import("./types").CollectionData} */
		const data = { name: collection.name, projects: [] };
		aside.push(data);

		for (const project_index of collection.projects) {
			const project = projects[project_index];
			data.projects.push({
				name: project.name,
				link: `/tree/${project.id}`,
				filetype: project.filetype,
				associated: project.children.length
			});
		}
	}

	return {
		on_deck,
		aside
	};
}
