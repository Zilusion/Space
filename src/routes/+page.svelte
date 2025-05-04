<script>
	import {
		selectedPlanet1Id,
		selectedPlanet2Id,
		selectedPlanet1,
		selectedPlanet2
	} from '$lib/stores/selectedPlanets';
	import { base } from '$app/paths';
	import PlanetSelector from '$lib/components/PlanetSelector.svelte';
	import ComparisonSection from '$lib/components/ComparisonSection.svelte';
	import { planets } from '$lib/data/planets';
	import '../app.scss';

	function handlePlanet1Change(newId) {
		selectedPlanet1Id.set(newId);
	}

	function handlePlanet2Change(newId) {
		selectedPlanet2Id.set(newId);
	}

	let availablePlanetsForSelector1 = $derived(
		planets.filter((planet) => planet.id !== $selectedPlanet2Id)
	);
	let availablePlanetsForSelector2 = $derived(
		planets.filter((planet) => planet.id !== $selectedPlanet1Id)
	);
</script>

<div class="container">
	<header class="page-header">
		<img src="{base}/images/logo.webp" alt="КОСМОС Лого" class="logo-image" />
	</header>

	<main>
		<div class="selectors">
			<PlanetSelector
				options={availablePlanetsForSelector1}
				value={$selectedPlanet1Id}
				onChange={handlePlanet1Change}
				planetNumber={1}
			/>
			<span class="vs">VS</span>
			<PlanetSelector
				options={availablePlanetsForSelector2}
				value={$selectedPlanet2Id}
				onChange={handlePlanet2Change}
				planetNumber={2}
			/>
		</div>

		{#if $selectedPlanet1 && $selectedPlanet2}
			<ComparisonSection planet1={$selectedPlanet1} planet2={$selectedPlanet2} />
		{:else}
			<p>Выберите две планеты для сравнения.</p>
		{/if}
	</main>
</div>

<style lang="scss">
	.container {
		min-height: 100vh;
		max-width: 840px;
		padding: clamp(1rem, 3vw, 2rem);
		padding-top: 0;
		display: grid;
		grid-template-rows: auto auto 1fr;
		gap: clamp(1.5rem, 5vh, 3rem);
		margin-inline: auto;
	}

	.page-header {
		text-align: center;
		padding-block: 40px;
		background: url('/images/header-bg.webp') center center/contain no-repeat;
	}

	.logo-image {
		width: 100%;
	}

	.selectors {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: clamp(1rem, 5vw, 4rem);
		margin-bottom: 100px;
	}

	.vs {
		font-size: 4rem;
		background: linear-gradient(to right, var(--gradient-vs-colors));
		color: transparent;
		background-clip: text;
		opacity: 0.8;
	}
</style>
