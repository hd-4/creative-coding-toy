<script context="module">
	export const inputs = {
		something: {
			value: 320,
			min: 0,
			max: 400
		}
	};
</script>

<script>
	export let inputs;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
	<rect fill="red" x="0" y="0" width="400" height="300" />
	<rect fill="white" x="0" y="0" width={inputs.something} height="300" />
</svg>
