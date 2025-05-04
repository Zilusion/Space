<script>
	import { base } from '$app/paths';
	import AnimatedNumber from './AnimatedNumber.svelte';
	import GravityJump from './GravityJump.svelte';

	let { key = '', planet = null, value = null, position = 'left' } = $props();

	let diameterPx = $derived(planet ? 100 + planet.diameter / 1000 : 0);
	let earthCount = $derived(planet ? Math.max(0, Math.floor(planet.mass)) : 0);

	function getTemperatureEmoji(temp) {
		if (temp === null || temp === undefined) return [];
		if (temp <= -65) return ['skull', 'snowflake'];
		if (temp >= -65 && temp < -15) return ['cold'];
		if (temp >= -15 && temp < 40) return ['cool'];
		if (temp >= 40 && temp < 200) return ['hot'];
		if (temp >= 200) return ['skull', 'fire'];
		return [];
	}
	let temperatureImageNames = $derived(getTemperatureEmoji(planet?.temperature));

	const MASS_MEDIUM_THRESHOLD = 40;
	const MASS_LARGE_THRESHOLD = 100;

	let massGridColumns = $derived(
		earthCount > MASS_LARGE_THRESHOLD ? 12 : earthCount > MASS_MEDIUM_THRESHOLD ? 9 : 7
	);

	let earthIconScale = $derived(
		earthCount > MASS_LARGE_THRESHOLD ? 0.65 : earthCount > MASS_MEDIUM_THRESHOLD ? 0.8 : 1.0
	);

	let massGridGap = $derived(
		earthCount > MASS_LARGE_THRESHOLD ? '3px' : earthCount > MASS_MEDIUM_THRESHOLD ? '5px' : '10px'
	);
</script>

<div class="comparison-item comparison-item--{position} comparison-item--{key}">
	{#if key === 'diameter'}
		<div class="comparison-item__visual comparison-item__visual--diameter">
			{#if planet}
				<img
					src={planet.image
						? `${base}${planet.image}`
						: `${base}/images/universe/planets/${planet.id}.webp`}
					alt={planet.name}
					class="planet-image"
					style="width: {diameterPx}px; height: {diameterPx}px;"
					title={`Диаметр: ${planet.diameter.toLocaleString('ru-RU')} км`}
				/>
			{/if}
		</div>
	{:else if key === 'mass'}
		<div
			class="comparison-item__visual comparison-item__visual--mass"
			style:--mass-grid-columns={massGridColumns}
			style:--earth-icon-scale={earthIconScale}
			style:--mass-grid-gap={massGridGap}
			title={`Масса ~ ${earthCount} Земель`}
		>
			{#if earthCount > 0}
				{#each Array(earthCount) as _, i (i)}
					<img
						src="{base}/images/universe/planets/earth.webp"
						alt=""
						aria-hidden="true"
						class="earth-icon"
						title={`Масса ~ ${earthCount} Земель`}
						loading="lazy"
					/>
				{/each}
			{/if}
		</div>
	{:else if key === 'temperature'}
		<div class="comparison-item__visual comparison-item__visual--temperature">
			{#each temperatureImageNames as imageName (imageName)}
				<img
					src="{base}/images/emoji/{imageName}.webp"
					alt={imageName}
					class="temperature-emoji-image"
				/>
			{/each}
		</div>
	{:else if key === 'orbit'}
		<div class="comparison-item__visual comparison-item__visual--orbit"></div>
	{:else if key === 'gravity'}
		<div class="comparison-item__visual comparison-item__visual--gravity">
			<GravityJump gravityValue={value} />
		</div>
	{/if}

	<div class="comparison-item__value">
		<AnimatedNumber
			{value}
			precision={key === 'diameter' ? 0 : key === 'mass' ? 3 : key === 'gravity' ? 2 : 1}
		/>
	</div>
</div>

<style lang="scss">
	.comparison-item {
		display: grid;
		height: 100%;
		width: fit-content;
	}

	.comparison-item--temperature {
		display: flex;
		gap: max(20px, min(40px, 5vw));
		align-items: center;
	}

	.comparison-item--mass {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.comparison-item--temperature.comparison-item--right {
		flex-direction: row-reverse;
	}

	.comparison-item--left {
		justify-self: flex-start;
		text-align: left;
	}

	.comparison-item--right {
		justify-self: flex-end;
		text-align: right;
	}

	.comparison-item__visual {
		display: grid;
		place-items: center;
		transition: all var(--transition-time) ease-in-out;
	}

	.comparison-item__visual--mass {
		--mass-grid-columns: 7;
		--earth-icon-scale: 1;
		--mass-grid-gap: 10px;
		grid-template-columns: repeat(var(--mass-grid-columns), auto);
		gap: var(--mass-grid-gap);
		justify-content: center;
		align-content: flex-end;
		height: 100%;
		flex: 1;
		display: grid;

		margin: 0 auto;
		overflow: hidden;
	}

	.comparison-item__visual--temperature {
		display: flex;
		align-items: flex-start;
		height: 100%;
	}

	.comparison-item__visual--orbit {
		min-height: 40px;
		width: 100%;
	}

	.comparison-item__visual--gravity {
		display: flex;
		justify-content: center;
		align-items: flex-end; 
		height: 100%;
		min-height: 150px;
		padding-bottom: 10px;
	}

	.earth-icon {
		--icon-base-size: clamp(14px, 2.2vw, 20px);
		width: calc(var(--icon-base-size) * var(--earth-icon-scale));
		height: calc(var(--icon-base-size) * var(--earth-icon-scale));
		object-fit: contain;
		transition:
			width 0.2s ease-out,
			height 0.2s ease-out;
	}

	.temperature-emoji-image {
		align-self: flex-start;
		height: var(--font-size-numbers);
		width: var(--font-size-numbers);
		filter: drop-shadow(0 0px 25px rgb(from #ffffff r g b / 20%));
	}

	.comparison-item__value {
		font-size: var(--font-size-numbers);
		background: linear-gradient(to right, var(--gradient-prime-colors));
		color: transparent;
		background-clip: text;
		filter: drop-shadow(0 2px 35px rgb(from #ffffff r g b / 40%)) drop-shadow(0 -1px 1px #947533)
			drop-shadow(0 1px 1px #cab05c);
		align-self: flex-end;
	}
</style>
