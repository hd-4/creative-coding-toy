export function import_runtime() {
	const url = document.body.dataset.hostUrl;
	if (!url) throw new Error('Host URL is not set!');
	return import(/* @vite-ignore */ url);
}
