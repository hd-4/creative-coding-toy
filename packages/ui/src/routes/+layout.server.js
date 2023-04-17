import { error } from '@sveltejs/kit';

/** @type {import("./$types").LayoutServerLoad} */
export function load({ platform }) {
	if (!platform) throw error(503);

	return {
		runtime_import_path: platform.req.cctoy_meta.manifest.start_url
	};
}
