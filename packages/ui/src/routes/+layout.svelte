<script>
	import { onMount } from 'svelte';
	import '../css/main.css';

	/** @type {import("./$types").LayoutData}*/
	export let data;

	onMount(async () => {
		const start = await import(/* @vite-ignore */ data.runtime_import_path);
		start.start();
	});
</script>

<slot />
