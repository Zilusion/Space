<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { base } from '$app/paths';
	import ComparisonItem from './ComparisonItem.svelte';

	let {
		label = '',
		key = '',
		unit = '',
		description = '',
		planet1 = null,
		planet2 = null,
		value1 = null,
		value2 = null
	} = $props();

	let comparisonSymbol = $derived(value1 === value2 ? '=' : value1 > value2 ? '>' : '<');

	const symbolOpacity = tweened(0, { duration: 100, easing: cubicOut });
	const symbolScale = tweened(0.5, { duration: 300, easing: cubicOut });

	$effect(() => {
		symbolOpacity.set(0).then(() => symbolOpacity.set(1));
		symbolScale.set(0.5).then(() => symbolScale.set(1));
		const _trigger = comparisonSymbol;
	});

	const MAX_ORBIT_DISTANCE = 4550;
	const SUN_RADIUS_PERCENT = 20;
	const ORBIT_LINE_START_PERCENT = SUN_RADIUS_PERCENT * 1.5;
	const ORBIT_LINE_AVAILABLE_WIDTH_PERCENT = 95 - ORBIT_LINE_START_PERCENT;

	function calculateOrbitPositionPercent(orbitValue) {
		if (orbitValue === null || orbitValue === undefined || MAX_ORBIT_DISTANCE <= 0)
			return `${ORBIT_LINE_START_PERCENT}%`;
		const scaledPercent = (orbitValue / MAX_ORBIT_DISTANCE) * ORBIT_LINE_AVAILABLE_WIDTH_PERCENT;
		const finalPercent = ORBIT_LINE_START_PERCENT + scaledPercent;
		return `${Math.max(ORBIT_LINE_START_PERCENT, Math.min(finalPercent, 98))}%`;
	}

	function calculatePlanetImageSize(diameter) {
		const MIN_SIZE_PX = 5;
		const MAX_SIZE_PX = 60;

		if (diameter === null || diameter === undefined || diameter <= 0) {
			return `${MIN_SIZE_PX}px`;
		}
		const calculatedSize = diameter / 1000;
		const finalSize = Math.max(MIN_SIZE_PX, Math.min(calculatedSize, MAX_SIZE_PX));

		return `${finalSize}px`;
	}

	let orbitPosPercent1 = $derived(calculateOrbitPositionPercent(planet1?.orbit));
	let orbitPosPercent2 = $derived(calculateOrbitPositionPercent(planet2?.orbit));
	let planetSize1 = $derived(calculatePlanetImageSize(planet1?.diameter));
	let planetSize2 = $derived(calculatePlanetImageSize(planet2?.diameter));

	let orbitPlanetStyle1 = $derived(
		`left: ${orbitPosPercent1}; width: ${planetSize1}; height: ${planetSize1};`
	);
	let orbitPlanetStyle2 = $derived(
		`left: ${orbitPosPercent2}; width: ${planetSize2}; height: ${planetSize2};`
	);
</script>

<div class="comparison-row comparison-row--{key}">
	<div class="comparison-row__header">
		<h3 class="comparison-row__title">
			{label}{#if key !== 'mass' && unit}, {unit}{/if}
		</h3>
		<p class="comparison-row__description">{description}</p>
	</div>

	{#if key === 'orbit'}
		<div class="comparison-row__orbit-visualization">
			<img src="{base}/images/universe/stars/sun.png" alt="Sun" class="orbit-sun" />
			<div class="orbit-line"></div>
			{#if planet1}
				<img
					src="{planet1.image ? `${base}${planet1.image}` : `${base}/images/universe/planets/${planet1.id}.webp`}"
					alt={planet1.name}
					class="orbit-planet-image"
					style={orbitPlanetStyle1}
					title={`${planet1.name}: ${planet1.orbit.toLocaleString('ru-RU')} млн км`}
				/>
			{/if}
			{#if planet2}
				<img
					src="{planet2.image ? `${base}${planet2.image}` : `${base}/images/universe/planets/${planet2.id}.webp`}"
					alt={planet2.name}
					class="orbit-planet-image"
					style={orbitPlanetStyle2}
					title={`${planet2.name}: ${planet2.orbit.toLocaleString('ru-RU')} млн км`}
				/>
			{/if}
		</div>
	{/if}

	<div class="comparison-row__item comparison-row__item--left">
		<ComparisonItem {key} planet={planet1} value={value1} position="left" />
	</div>

	<div class="comparison-row__symbol-container">
		<div
			class="comparison-row__symbol"
			style="opacity: {$symbolOpacity}; transform: scale({$symbolScale});"
		>
			{#if comparisonSymbol === '<'}
				<svg
					width="32"
					height="56"
					viewBox="0 0 32 56"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="comparison-row__symbol-icon comparison-row__symbol-icon--left"
					><path
						d="M32 0H24V8H16V16H8V24H0V32H8V40H16V48H24V56H32V40H24V32H16V24H24V16H32V0Z"
						fill="var(--color-accent-primary)"
					/></svg
				>
			{:else if comparisonSymbol === '>'}
				<svg
					width="32"
					height="56"
					viewBox="0 0 32 56"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="comparison-row__symbol-icon comparison-row__symbol-icon--right"
					><path
						d="M0 0H8V8H16V16H24V24H32V32H24V40H16V48H8V56H0V40H8V32H16V24H8V16H0V0Z"
						fill="var(--color-accent-secondary)"
					/></svg
				>
			{:else}
				<span></span>
			{/if}
		</div>
	</div>

	<div class="comparison-row__item comparison-row__item--right">
		<ComparisonItem {key} planet={planet2} value={value2} position="right" />
	</div>
</div>

<style lang="scss">
	.comparison-row {
		display: grid;
		grid-template-columns: minmax(150px, 1fr) auto minmax(150px, 1fr);
		grid-template-areas:
			'header header header'
			'item-left symbol item-right';
		position: relative;
		padding: 15px 0;
		gap: 30px;
	}

	.comparison-row--orbit {
		grid-template-areas:
			'header header header'
			'item-left symbol item-right'
			'orbit orbit orbit';
	}

	.comparison-row__header {
		text-align: center;
		grid-area: header;
	}

	.comparison-row__title {
		font-size: var(--font-size-title);
		letter-spacing: var(--font-ls-wide);
		color: var(--color-accent-prime);
		white-space: nowrap;
		text-transform: uppercase;
		filter: drop-shadow(0 2px 20px rgb(from #7ec2c5 r g b / 80%)) drop-shadow(0 -1px 1px #519433)
			drop-shadow(0 1px 1px #5c80ca);
	}

	.comparison-row__description {
		font-size: var(--font-size-description);
		color: var(--color-text-additional);
		filter: drop-shadow(0 2px 35px rgb(from #81b0b7 r g b / 60%)) drop-shadow(0 -1px 1px #609433)
			drop-shadow(0 1px 1px #5c9cca);
	}

	.comparison-row__item {
		width: 100%;
	}

	.comparison-row__item--left {
		grid-area: item-left;
	}

	.comparison-row__item--right {
		grid-area: item-right;
	}

	.comparison-row__symbol-container {
		display: grid;
		place-content: center;
		grid-area: symbol;
	}

	.comparison-row__symbol {
		height: 56px;
		width: 32px;
	}
	.comparison-row__symbol-icon--left {
		filter: drop-shadow(-1px 0 10px rgb(from #fcb303 r g b / 50%));
	}
	.comparison-row__symbol-icon--right {
		filter: drop-shadow(-1px 0 10px rgb(from #fc6b03 r g b / 50%));
	}

	.comparison-row__orbit-visualization {
		grid-area: orbit;
		position: relative;
		height: 40px;
		z-index: 1;
		bottom: 0;
		left: 0;
		width: clamp(0px, 100%, 1920px);
	}

	.orbit-sun {
		position: absolute;
		top: 50%;
		translate: -85% -50%;
		width: clamp(200px, 300vw, 4096px);
		aspect-ratio: 1;
		max-width: none;
		z-index: 1;
		pointer-events: none;
		user-select: none;
		will-change: rotate;
		
		&:hover {
			animation: rotate 240s infinite linear;
		}
	}

	@keyframes rotate {
		0% {
			rotate: 0;
		}
		100% {
			rotate: 360deg;
		}
	}

	.orbit-line {
		position: absolute;
		height: 1px;
		left: -100vw;
		top: 0;
		right: 0;
		background: linear-gradient(to right, var(--gradient-orbit-colors));
		z-index: 0;
	}

	.orbit-planet-image {
		position: absolute;
		translate: 0 -50%;
		transition: all var(--transition-time-long);
		z-index: 1;
		pointer-events: none;
		user-select: none;
	}
</style>
