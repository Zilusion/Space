<script>
	import ComparisonRow from './ComparisonRow.svelte';
	let { planet1, planet2 } = $props();

	const comparisonData = [
		{
			label: 'ДИАМЕТР',
			unit: 'км',
			key: 'diameter',
			description: 'расстояние между противоположными точками экватора'
		},
		{
			label: 'ТЕМПЕРАТУРА',
			unit: '°C',
			key: 'temperature',
			description: 'на поверхности или в верхних слоях атмосферы'
		},
		{
			label: 'МАССА',
			unit: 'отн. массы Земли',
			key: 'mass',
			description: 'относительная масса планеты к массе Земли'
		},
		{
			label: 'ОРБИТА',
			unit: 'млн км',
			key: 'orbit',
			description: 'среднее расстояние от центра планеты до солнца'
		}
		// { label: 'СПУТНИКИ', unit: '', key: 'satellites', description: 'количество естественных спутников на орбите' },
		// { label: 'ГОД', unit: 'суток', key: 'year', description: 'время полного оборота вокруг солнца в земных сутках' },
	];
</script>

<div class="comparison-grid">
	{#each comparisonData as row}
		<ComparisonRow
			label={row.label}
			unit={row.unit}
			value1={planet1[row.key]}
			value2={planet2[row.key]}
			isTemperature={row.key === 'temperature'}
			{planet1}
			{planet2}
		/>
	{/each}
</div>

<style>
	.comparison-grid {
		display: grid;
		gap: clamp(1rem, 3vh, 2rem);
		max-width: 900px;
		margin: 0 auto;
	}
</style>
