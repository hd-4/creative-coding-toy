<script>
	import { clickable_parent } from './clickable-parent.js';
	import JavaScriptIcon from '$lib/assets/javascript.svg';
	import SvelteIcon from '$lib/assets/svelte.svg';

	/** @type {import("./types").ProjectTileData}*/
	export let project;
</script>

<li class="_on-deck-project inset" data-inset-size="xs" use:clickable_parent>
	<div class="stack" data-stack-size="lg">
		<div>
			{#if project.associated}
				<div class="_on-deck-project__tag">group</div>
			{/if}
			<a class="_on-deck-project__link" href={project.link}>{project.name}</a>
		</div>
		<div class="beads _on-deck-project__info" data-stack-break data-beads-size="2xs">
			{#if project.associated}
				<span class="">{project.associated} projects</span>
			{:else if project.filetype === 'js'}
				<img class="icon" src={JavaScriptIcon} alt="JavaScript" />
				<span>JavaScript</span>
			{:else if project.filetype === 'svelte'}
				<img class="icon" src={SvelteIcon} alt="Svelte" />
				<span>Svelte</span>
			{:else}
				<span>Unknown</span>
			{/if}
		</div>
	</div>
</li>

<style>
	._on-deck-project {
		border: var(--border-size-1) solid var(--gray-5);
		border-radius: var(--radius-1);
		box-shadow: var(--shadow-2);
		background-color: var(--surface-0);
	}

	._on-deck-project ._on-deck-project__tag {
		text-transform: uppercase;
		font-weight: var(--font-weight-8);
		font-size: var(--font-size--1);
		color: var(--text-3);
	}

	._on-deck-project ._on-deck-project__link {
		font-weight: var(--font-weight-8);
		text-decoration: none;
		color: var(--text-1);
	}

	._on-deck-project ._on-deck-project__info {
		font-size: var(--font-size--1);
	}
</style>
