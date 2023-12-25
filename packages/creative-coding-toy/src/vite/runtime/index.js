import { Host } from "./host.js";

export const host = new Host();

if (import.meta.hot) {
	import.meta.hot.on("manifest-updated", () => {
		host.notify_manifest_listeners();
	});
}

/**
 * Hack: TypeScript won't pick up the Vite client types unless a file that
 * references them is imported. There isn't any logic in this file, so just use the import.
 *
 * @typedef {import("creative-coding-toy")} DummyImport
 */
