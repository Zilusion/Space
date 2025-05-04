<script>
	import {
		selectedPlanet1Id,
		selectedPlanet2Id,
		selectedPlanet1,
		selectedPlanet2
	} from '$lib/stores/selectedPlanets';
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
	<header>
		<!-- <h1>КОСМОС</h1> -->
		<img src="/images/logo.png" alt="">
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

	<div class="background-planet"></div>
</div>

<style>
	.container {
		display: grid;
		grid-template-rows: auto auto 1fr;
		min-height: 100vh;
		padding: clamp(1rem, 5vw, 3rem);
		position: relative;
		overflow: hidden;
		gap: clamp(1rem, 4vh, 3rem);
	}

	header {
		text-align: center;
	}

	header h1 {
		font-size: clamp(2.5rem, 10vw, 6rem);
	}

	.selectors {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: clamp(1rem, 5vw, 4rem);
		flex-wrap: wrap;
	}

	.vs {
		font-weight: bold;
		font-size: clamp(1.2rem, 3vw, 2rem);
		color: var(--accent-color, #aaa);
	}

	.background-planet {
		position: absolute;
		left: -38%;
		top: 35vh;
		width: clamp(400px, 80vw, 1200px);
		height: clamp(400px, 80vw, 1200px);
		background-image: url('/images/space/stars/sun.png');
		background-size: contain;
		border-radius: 50%;
		z-index: -1;
		transition: background-image 0.5s ease-in-out;
	}

</style>
