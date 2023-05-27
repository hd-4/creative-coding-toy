<script context="module">
	export const input_config = {
		value_b: "bar"
	};
</script>

<script>
	import { onDestroy, onMount } from "svelte";

	export let inputs;

	onMount(() => {
		console.log("[test] svelte lifecycle", "mount");
	});

	onDestroy(() => {
		console.log("[test] svelte lifecycle", "destroy");
	});
</script>

<div data-testid="output">{inputs.value_b}</div>
