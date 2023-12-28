<script context="module">
	export const input_config = {
		value_a: "foo",
		value_b: "bar"
	};
</script>

<script>
	export let inputs;
</script>

<div data-testid="output_a">{inputs.value_a}</div>
<div data-testid="output_b">{inputs.value_b}</div>
