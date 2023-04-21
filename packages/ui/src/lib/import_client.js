export function import_client() {
	const url = document.body.dataset.clientUrl;
	if (!url) throw new Error('Client URL is not set!');
	return import(/* @vite-ignore */ url);
}
