<script>
	import { onDestroy, onMount } from 'svelte';

	/** @type {unknown} */
	export let mod;

	/** @type {any} */
	export let engine;

	/** @type {unknown} */
	export let props;

	/** @type {HTMLElement} */
	let container;

	/** @type {{update_inputs(inputs: any): void, destroy: () => void} | null}*/
	let project_instance = null;

	onMount(() => {
		project_instance = engine.mount(mod, container, {
			inputs: props
		});
	});

	$: update_project(mod, engine);
	function update_project(mod, engine) {
		if (!project_instance) return;
		project_instance.destroy();
		project_instance = engine.mount(mod, container, {
			inputs: props
		});
	}

	$: update_props(props);
	function update_props(new_props) {
		if (!project_instance) return;
		project_instance.update_inputs(new_props);
	}

	onDestroy(() => {
		if (!project_instance) return;
		project_instance.destroy();
	});
</script>

<div bind:this={container} />
