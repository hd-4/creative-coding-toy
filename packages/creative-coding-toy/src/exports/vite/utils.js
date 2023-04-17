import path from "node:path";
import { fileURLToPath } from "node:url";

export const runtime_directory = fileURLToPath(
	new URL("../../runtime", import.meta.url)
);

export const runtime_base = runtime_directory.startsWith(process.cwd())
	? `/${path.relative(".", runtime_directory)}`
	: `/@fs${runtime_directory}`;
