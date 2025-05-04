<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let { value = 0, duration = 500, precision = 1 } = $props();

	const animatedValue = tweened(value, {
		duration: duration,
		easing: cubicOut
	});
	$effect(() => {
		animatedValue.set(value);
	});

	let formattedValue = $derived(
		($animatedValue).toLocaleString('ru-RU', {
			minimumFractionDigits: ($animatedValue % 1 === 0 ? 0 : precision),
			maximumFractionDigits: precision
		})
	);
</script>

<span>{formattedValue}</span>

<style>
	span {
		display: inline-block;
		min-width: 1.5em;
		text-align: inherit;
	}
</style>