import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, platform }) {
	if (!platform) error(503);

	const { projects, collections } = platform.req.cctoy_meta.manifest;
	const project = projects.find((p) => p.id === params.id);
	if (!project) error(404, 'Project not found');

	const collection = project.collection !== null ? collections[project.collection] : null;
	const parent = project.parent !== null ? projects[project.parent] : null;
	const siblings = parent ? parent.children.map((i) => projects[i]) : null;
	const children = project.children.map((i) => projects[i]);

	const preload_result = await project.preload();

	return {
		project_name: project.name,
		collection: collection?.name ?? null,
		parent: parent ? { name: parent.name, link: `/tree/${parent.id}` } : null,
		siblings: siblings?.map((p) => ({ name: p.name, link: `/tree/${p.id}` })) ?? null,
		children: children?.map((p) => ({ name: p.name, link: `/tree/${p.id}` })) ?? null,

		preload_result,
		filetype: project.filetype,
		project_import_path: project.import_path
	};
}
