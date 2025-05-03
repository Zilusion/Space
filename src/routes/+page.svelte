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

	// Function to update the first store
	function handlePlanet1Change(event) {
		selectedPlanet1Id.set(event.detail); // Use the store's .set method
	}

	// Function to update the second store
	function handlePlanet2Change(event) {
		selectedPlanet2Id.set(event.detail); // Use the store's .set method
	}

	$: availablePlanetsForSelector1 = planets.filter((planet) => planet.id !== $selectedPlanet2Id);
	$: availablePlanetsForSelector2 = planets.filter((planet) => planet.id !== $selectedPlanet1Id);
</script>

<div class="container">
	<header>
		<h1>КОСМОС</h1>
	</header>

	<main>
		<div class="selectors">
			<PlanetSelector options={availablePlanetsForSelector1} value={$selectedPlanet1Id} on:change={handlePlanet1Change} planetNumber={1} />
			<span class="vs">VS</span>
			<PlanetSelector options={availablePlanetsForSelector2} value={$selectedPlanet2Id} on:change={handlePlanet2Change} planetNumber={2} />
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
	/* Стили остаются без изменений */
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
		/* ... */
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
		left: -30%;
		top: 10%;
		width: clamp(400px, 80vw, 1200px);
		height: clamp(400px, 80vw, 1200px);
		/* background: url('/path/to/default-planet.png') no-repeat center center; */ /* Не забудь раскомментировать и указать путь */
		background-color: #553311; /* Временный цвет для фона */
		background-size: contain;
		border-radius: 50%; /* Сделать круглым */
		opacity: 0.3;
		z-index: -1;
		transition: background-image 0.5s ease-in-out;
	}

	:global(:root) {
		--text-color: #eee;
		--accent-color: #4ade80;
		--bg-color: #000;
		font-family: 'Arial', sans-serif;
	}
	:global(body) {
		background-color: var(--bg-color);
		color: var(--text-color);
		margin: 0;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif; /* Более системный шрифт */
	}
</style>
