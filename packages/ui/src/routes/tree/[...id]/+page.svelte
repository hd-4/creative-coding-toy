<script>
	import { onDestroy } from 'svelte';
	import Project from './Project.svelte';
	import { browser } from '$app/environment';
	import { create_tweakpane } from './tweakpane';

	export let data;

	/**
	 * @type {{ params: any; update_schema: any; destroy: any; } | null}
	 */
	let tweakpane;

	let project_props = {};

	$: update_tweakpane(data.project_module?.inputs);
	function update_tweakpane(schema) {
		if (!browser) return;
		if (!tweakpane && schema) {
			tweakpane = create_tweakpane(schema, () => (project_props = tweakpane?.params));
			project_props = tweakpane.params;
		} else if (tweakpane && schema) {
			tweakpane.update_schema(schema);
			project_props = tweakpane.params;
		} else if (tweakpane && !schema) {
			tweakpane.destroy();
			tweakpane = null;
		}
	}

	onDestroy(() => {
		if (!tweakpane) return;
		tweakpane.destroy();
		tweakpane = null;
	});
</script>

<svelte:head>
	<title>{data.project_name}</title>
</svelte:head>

<div class="region">
	<div class="_layout">
		<div class="_title">{data.project_name}</div>
		<div class="_output">
			{#if browser && data.engine.mod}
				<Project mod={data.project_module} engine={data.engine.mod} props={project_props} />
			{/if}
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
