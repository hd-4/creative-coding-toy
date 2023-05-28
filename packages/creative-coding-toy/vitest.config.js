import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		isolate: false,
		singleThread: true,
		include: ["src/p5_transform/**/*.spec.js", "src/sync/**/*.spec.js"],
		exclude: ["**/node_modules/**"],
		watchExclude: ["**/node_modules/**"]
	}
});
