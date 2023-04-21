import { dev } from '$app/environment';

/** @type {import("@sveltejs/kit").Handle} */
export async function handle({ event, resolve }) {
	if (dev) {
		const dev_platform = await import('./dev/platform.server.js');
		event.platform = /** @type {any} */ (dev_platform.platform);
	}

	const response = await resolve(event, {
		transformPageChunk({ html }) {
			if (!event.platform) return html;
			return html.replace('%client_url%', event.platform?.req.cctoy_meta.manifest.start_url);
		}
	});
	return response;
}
