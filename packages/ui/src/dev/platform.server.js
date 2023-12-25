const platform = {
	req: {
		cctoy_meta: {
			/** @type {import("ui").ServerManifest} */
			manifest: {
				start_url: '/src/dev/runtime.js',

				projects: [
					{
						id: 'project-1',
						name: 'Project 1',
						filetype: 'js',
						import_path: '/src/dev/sample_project.js',
						collection: null,
						parent: null,
						children: [],
						preload() {
							return Promise.resolve({});
						}
					},
					{
						id: 'project-2',
						name: 'Project 2',
						filetype: 'js',
						import_path: '/src/dev/sample_project.js',
						collection: null,
						parent: null,
						children: [2, 3],
						preload() {
							return Promise.resolve({});
						}
					},
					{
						id: 'project-2/nested-a',
						name: 'Nested A',
						filetype: 'js',
						import_path: '/src/dev/sample_project.js',
						collection: null,
						parent: 1,
						children: [],
						preload() {
							return Promise.resolve({});
						}
					},
					{
						id: 'project-2/nested-b',
						name: 'Nested B',
						filetype: 'js',
						import_path: '/src/dev/sample_project.js',
						collection: null,
						parent: 1,
						children: [],
						preload() {
							return Promise.resolve({});
						}
					},
					{
						id: 'svelte-project',
						name: 'Svelte Project',
						filetype: 'svelte',
						import_path: '/src/dev/sample_project.js',
						collection: null,
						parent: null,
						children: [],
						preload() {
							return Promise.resolve({});
						}
					},
					{
						id: 'collection-1/project-3',
						name: 'Project 3',
						filetype: 'js',
						import_path: '/src/dev/sample_project.js',
						collection: 0,
						parent: null,
						children: [],
						preload() {
							return Promise.resolve({});
						}
					},
					{
						id: 'collection-1/project-4',
						name: 'Project 4',
						filetype: 'js',
						import_path: '/src/dev/sample_project.js',
						collection: 0,
						parent: null,
						children: [],
						preload() {
							return Promise.resolve({});
						}
					},
					{
						id: 'collection-2/project-5',
						name: 'Project 5',
						filetype: 'js',
						import_path: '/src/dev/sample_project.js',
						collection: 1,
						parent: null,
						children: [],
						preload() {
							return Promise.resolve({});
						}
					},
					{
						id: 'collection-2/project-6',
						name: 'Project 6',
						filetype: 'js',
						import_path: '/src/dev/sample_project.js',
						collection: 1,
						parent: null,
						children: [],
						preload() {
							return Promise.resolve({});
						}
					}
				],

				collections: [
					{
						id: 'collection-1',
						name: 'Collection 1',
						projects: [5, 6]
					},
					{
						id: 'collection-2',
						name: 'Collection 2',
						projects: [7, 8]
					}
				]
			}
		}
	}
};

export { platform };
