<script context="module">
	export const input_config = {
		value_a: "foo"
	};
</script>

<script>
	export let inputs;
</script>

<div data-testid="output">{inputs.value_a}</div>
