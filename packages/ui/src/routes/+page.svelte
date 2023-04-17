<script>
	import ActiveProject from './ActiveProject.svelte';

	/** @type {import("./$types").PageServerData}*/
	export let data;

	$: ({ on_deck, aside } = data);

	$: grid_count = on_deck.length >= 4 ? 'many' : on_deck.length;
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<div class="region">
	<h1 class="center">Projects</h1>
</div>

<div class="region">
	<div class="_column" data-active={grid_count}>
		<div class="stack" data-stack-size="xs">
			<div class="_title">Active</div>
			<ul class="adaptive-grid list-reset">
				{#each on_deck as project}
					<ActiveProject {project} />
				{/each}
			</ul>
		</div>

		<div>
			<ul class="list-reset stack" data-stack-size="s">
				{#each aside as collection}
					<li class="stack" data-stack-size="2xs">
						<div class="_title">{collection.name}</div>
						<ul class="list-reset">
							{#each collection.projects as project}
								<li class="_collection_project">
									<a href={project.link}>{project.name}</a>
									{#if project.associated > 0}
										(+{project.associated})
									{/if}
								</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	/* Composition */

	.adaptive-grid {
		--gap: var(--size-s);
		--count: 3;
		--total-gap: calc(var(--gap) * (var(--count) - 1));
		--cell-min: 200px;
		--cell-basis: calc((100% - var(--total-gap)) / var(--count));

		display: grid;
		gap: var(--gap);
		grid-auto-rows: 1fr;
		grid-template-columns: repeat(auto-fill, minmax(max(var(--cell-basis), var(--cell-min)), 1fr));
	}

	.adaptive-grid:has(:nth-child(4)) {
		--count: 4;
	}

	/* Utility */

	.list-reset {
		list-style-type: none;
		padding: 0;
	}

	.center {
		text-align: center;
	}

	/* Block */

	._column {
		--active-max: 0px;
		--inactive-max: 0px;

		display: grid;
		grid-template-columns: 1fr minmax(0, max(var(--active-max), var(--inactive-max))) 1fr;
		row-gap: var(--size-l);
	}

	._column[data-active='1'] {
		--active-max: 400px;
	}

	._column[data-active='2'] {
		--active-max: 600px;
	}

	._column[data-active='3'] {
		--active-max: 800px;
	}

	._column[data-active='many'] {
		--active-max: 100%;
	}

	._column > * {
		grid-column: 2;
	}

	._title {
		font-weight: var(--font-weight-6);
	}

	._collection_project a {
		text-decoration: none;
		color: var(--text-1);
	}
</style>
