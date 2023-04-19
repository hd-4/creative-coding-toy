<script>
	import { onMount } from 'svelte';
	import '../css/main.css';

	/** @type {import("./$types").LayoutData}*/
	export let data;

	onMount(async () => {
		const client = await import(/* @vite-ignore */ data.runtime_import_path);
		client.start();
	});
</script>

<slot />
