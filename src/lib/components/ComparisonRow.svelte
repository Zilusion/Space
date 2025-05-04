<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import AnimatedNumber from './AnimatedNumber.svelte';

	let { label, unit, value1, value2, isTemperature = false, planet1, planet2 } = $props();

	let comparisonSymbol = $derived(value1 === value2 ? '=' : value1 > value2 ? '>' : '<');
	let comparisonSymbolTemp = $derived(value1 === value2 ? '=' : value1 < value2 ? '>' : '<');

	let finalSymbol = $derived(isTemperature ? comparisonSymbolTemp : comparisonSymbol);

	const symbolOpacity = tweened(0, { duration: 100, easing: cubicOut });
	const symbolScale = tweened(0.5, { duration: 300, easing: cubicOut });

	$effect(() => {
		symbolOpacity.set(0).then(() => symbolOpacity.set(1));
		symbolScale.set(0.5).then(() => symbolScale.set(1));
		const _trigger = finalSymbol;
	});

	let planet1DiameterPx = $derived(100 + (planet1?.diameter || 0) / 1000);
	let planet2DiameterPx = $derived(100 + (planet2?.diameter || 0) / 1000);

	let earthCount1 = $derived(Math.floor(planet1?.mass || 0));
	let earthCount2 = $derived(Math.floor(planet2?.mass || 0));

	function getTemperatureEmoji(temp) {
		if (temp === null || temp === undefined) return '';
		if (temp >= 200) return '☠️🔥';
		if (temp >= 40) return '🥵';
		if (temp >= -60) return '😎';
		if (temp > -65) return '🥶';
		return '💀❄️';
	}

	let emoji1 = $derived(getTemperatureEmoji(planet1?.temperature));
	let emoji2 = $derived(getTemperatureEmoji(planet2?.temperature));
</script>

{#snippet valueContent(planet, diameterPx, earthCount, emoji)}
	{#if label === 'ДИАМЕТР'}
		<div class="diametr-viz-container">
			<img
				src={planet.image}
				alt={planet.name}
				class="planet-viz planet-diameter"
				style="width: {diameterPx}px; height: {diameterPx}px;"
				title={`Диаметр: ${planet.diameter.toLocaleString('ru-RU')} км`}
			/>
		</div>
	{:else if label === 'МАССА'}
		<div class="mass-viz-container">
			{#each Array(earthCount) as _, i (i)}
				<img
					src="/images/space/planets/earth.png"
					alt="Earth mass unit"
					class="earth-mass-unit"
					title={`Масса ~ ${earthCount} Земель`}
				/>
			{/each}
		</div>
	{:else if label === 'ТЕМПЕРАТУРА'}
		<span class="temp-emoji">{emoji}</span>
	{/if}
{/snippet}

<div class="row">
	<div class="value value1">
		{@render valueContent(planet1, planet1DiameterPx, earthCount1, emoji1)}
		<AnimatedNumber value={value1} />
	</div>

	<div class="label-container">
		{#if finalSymbol === '<'}
			<svg
				width="32"
				height="56"
				viewBox="0 0 32 56"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M32 0H24V8H16V16H8V24H0V32H8V40H16V48H24V56H32V40H24V32H16V24H24V16H32V0Z"
					fill="#FCB303"
				/>
			</svg>
		{:else}
			<svg
				width="32"
				height="56"
				viewBox="0 0 32 56"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0 0H8V8H16V16H24V24H32V32H24V40H16V48H8V56H0V40H8V32H16V24H8V16H0V0Z"
					fill="#FC6B03"
				/>
			</svg>
		{/if}
	</div>

	<div class="value value2">
		{@render valueContent(planet2, planet2DiameterPx, earthCount2, emoji2)}
		<AnimatedNumber value={value2} />
	</div>
</div>

<style>
	.row {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		text-align: center;
		gap: clamp(0.5rem, 2vw, 1.5rem);
		min-height: 50px;
	}

	.label-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.label {
		font-size: clamp(0.8rem, 1.8vw, 1.1rem);
		font-weight: bold;
		color: var(--accent-color, #4ade80);
		margin-bottom: 0.2em;
		white-space: nowrap;
	}

	.unit {
		font-size: clamp(0.6rem, 1.2vw, 0.8rem);
		color: #aaa;
		margin-bottom: 0.4em;
	}

	.value {
		font-size: clamp(1.5rem, 4vw, 2.5rem);
		font-weight: bold;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.value1 {
		text-align: right;
		align-items: flex-end;
		padding-right: 10px;
	}
	.value2 {
		text-align: left;
		align-items: flex-start;
		padding-right: 10px;
	}

	.symbol {
		font-size: clamp(1.2rem, 3vw, 2rem);
		color: #facc15;
		font-weight: bold;
		display: inline-block;
		min-width: 1em;
	}

	.planet-viz {
		display: block;
		object-fit: contain;
		margin: 5px 0;
	}

	.planet-diameter {
	}

	.mass-viz-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-bottom: 5px;
		max-width: 120px;
		align-self: center;
	}
	.value1 .mass-viz-container {
		justify-content: flex-end;
	}
	.value2 .mass-viz-container {
		justify-content: flex-start;
	}

	.earth-mass-unit {
		width: clamp(12px, 2vw, 18px);
		height: clamp(12px, 2vw, 18px);
		margin: 1px;
	}

	.temp-emoji {
		font-size: clamp(1.2rem, 3vw, 1.8rem);
		line-height: 1;
	}
</style>
