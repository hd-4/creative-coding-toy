<script>
	import { onMount } from 'svelte';
	import '../css/main.css';
	import { import_client } from '$lib/import_client.js';

	onMount(async () => {
		const client = await import_client();
		client.start();
	});
</script>

<slot />
