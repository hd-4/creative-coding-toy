<script>
	import { onDestroy, onMount } from 'svelte';
	import { create_tweakpane } from './tweakpane';
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { import_runtime } from '$lib/import_runtime.js';

	export let data;

	/** @type {HTMLElement} */
	let container;

	/** @type {any} */
	let project_instance;

	/** @type {any} */
	let project_listener;

	/** @type {any} */
	let tweakpane;

	let in_mount_callback = false;

	onMount(async () => {
		in_mount_callback = true;

		// Create new props
		let inputs;
		const new_schema = data.project_module?.input_config;
		if (new_schema) {
			tweakpane = create_tweakpane(new_schema, (new_inputs) => {
				update_inputs(new_inputs);
			});
			inputs = tweakpane.params;
		}

		// Load the project module if it didn't preload. This should fail just like
		// the preload did, but it'll throw an exception that the user can see.
		const { host } = await import_runtime();
		if (!data.preload_result.successful) {
			await host.load_project(data.project_import_path);
		}

		// Mount
		const engine = data.engine.mod;
		const project_module = data.project_module;
		project_instance = engine.mount(project_module, container, {
			inputs
		});

		// Set up HMR
		project_listener = host.add_project_listener(data.project_import_path, async () => {
			await invalidateAll();
			await reload_project();
		});

		in_mount_callback = false;
	});

	afterNavigate(async (after_navigate) => {
		// afterNavigate callbacks run on mount and after subsequent navigations,
		// but an onMount callback is already going to set up the project for the
		// first page load.
		if (in_mount_callback) return;

		// Clean up the existing project instance
		project_instance.destroy();
		project_listener.remove();
		if (tweakpane) tweakpane.destroy();

		// Create new props
		let inputs;
		const new_schema = data.project_module?.input_config;
		if (new_schema) {
			tweakpane = create_tweakpane(new_schema, (new_inputs) => {
				update_inputs(new_inputs);
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
		const host = await import_runtime();
		project_listener = host.add_project_listener(data.project_import_path, async () => {
			await invalidateAll();
			await reload_project();
		});
	});

	onDestroy(() => {
		if (project_instance) project_instance.destroy();
		if (project_listener) project_listener.remove();
		if (tweakpane) tweakpane.destroy();
	});

	function update_inputs(new_inputs) {
		project_instance.update_inputs(new_inputs);
	}

	async function reload_project() {
		// Update props
		let inputs;
		const new_schema = data.project_module?.input_config;
		if (tweakpane && new_schema) {
			tweakpane.update_schema(new_schema);
			inputs = tweakpane.params;
		} else if (tweakpane && !new_schema) {
			tweakpane.destroy();
			tweakpane = null;
		} else if (!tweakpane && new_schema) {
			tweakpane = create_tweakpane(new_schema, (new_inputs) => {
				update_inputs(new_inputs);
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
	<div class="page-column">
		<div class="_title">{data.project_name}</div>
		<div class="_output">
			<div class="_output__inner" bind:this={container} />
		</div>
	</div>
</div>

<!-- {#each data.siblings || [] as sibling}
	<div><a href={sibling.link}>{sibling.name}</a></div>
{/each}

{#each data.children || [] as child}
	<div><a href={child.link}>{child.name}</a></div>
{/each} -->

<style>
	._title {
		font-weight: var(--font-weight-7);
		text-align: center;
	}

	._output {
		display: grid;
		place-items: center;
	}

	._output__inner {
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	}
</style>
