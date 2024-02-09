import { creative_coding_toy } from "creative-coding-toy/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [creative_coding_toy(), svelte({ hot: false })]
};

export default config;
