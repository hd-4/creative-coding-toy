<script>
	import { onDestroy } from 'svelte';
	import { create_tweakpane } from './tweakpane';
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { import_client } from '$lib/import_client.js';

	export let data;

	/** @type {HTMLElement} */
	let container;

	/** @type {any} */
	let project_instance;

	/** @type {any} */
	let project_listener;

	/** @type {any} */
	let tweakpane;

	afterNavigate(async () => {
		// Clean up any existing mountings
		if (project_instance) project_instance.destroy();
		if (project_listener) project_listener.remove();
		if (tweakpane) tweakpane.destroy();

		// Create new props
		let inputs;
		const new_schema = data.project_module?.inputs;
		if (new_schema) {
			tweakpane = create_tweakpane(new_schema, () => {
				update_inputs();
			});
			inputs = tweakpane.params;
		}

		// Mount
		const engine = data.engine.mod;
		const project_module = data.project_module;
		project_instance = engine.mount(project_module, container, {
			inputs
		});

		// Set up HMR
		const client = await import_client();
		project_listener = client.add_project_listener(data.project_import_path, async () => {
			await invalidateAll();
			await reload_project();
		});
	});

	onDestroy(() => {
		if (project_instance) project_instance.destroy();
		if (project_listener) project_listener.remove();
		if (tweakpane) tweakpane.destroy();
	});

	function update_inputs() {
		project_instance.update_inputs(tweakpane.params);
	}

	async function reload_project() {
		// Update props
		let inputs;
		const new_schema = data.project_module?.inputs;
		if (tweakpane && new_schema) {
			tweakpane.update_schema(new_schema);
			inputs = tweakpane.params;
		} else if (tweakpane && !new_schema) {
			tweakpane.destroy();
			tweakpane = null;
		} else if (!tweakpane) {
			tweakpane = create_tweakpane(new_schema, () => {
				update_inputs();
			});
			inputs = tweakpane.params;
		}

		// Reload the project
		project_instance.destroy();
		const engine = data.engine.mod;
		const project_module = data.project_module;
		project_instance = engine.mount(project_module, container, {
			inputs
		});
	}
</script>

<svelte:head>
	<title>{data.project_name}</title>
</svelte:head>

<div class="region">
	<div class="_layout">
		<div class="_title">{data.project_name}</div>
		<div class="_output">
			<div bind:this={container} />
		</div>
	</div>
</div>

<style>
	._layout {
		display: grid;
		grid-template-columns: 1fr max-content 1fr;
		row-gap: var(--size-s);
	}

	._layout > * {
		grid-column: 2;
	}

	._title {
		font-weight: var(--font-weight-7);
		text-align: center;
	}

	._output {
		box-shadow: var(--shadow-5);
	}
</style>
