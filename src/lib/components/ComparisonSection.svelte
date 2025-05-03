<script>
    import ComparisonRow from './ComparisonRow.svelte';
    export let planet1;
    export let planet2;

    // Подготовка данных для строк
    const comparisonData = [
        { label: 'ДИАМЕТР', unit: 'км', key: 'diameter' },
        { label: 'МАССА', unit: 'отн. массы Земли', key: 'mass' },
        { label: 'СПУТНИКИ', unit: '', key: 'satellites' },
        { label: 'ОРБИТА', unit: 'млн км', key: 'orbit' },
        { label: 'ГОД', unit: 'суток', key: 'year' },
        { label: 'ТЕМПЕРАТУРА', unit: '°C', key: 'temperature' },
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
            p1={planet1}
            p2={planet2}
        />
    {/each}
</div>

<style>
    .comparison-grid {
        display: grid;
        gap: clamp(1rem, 3vh, 2rem); /* Fluid gap */
        max-width: 900px; /* Ограничение ширины для читаемости */
        margin: 0 auto; /* Центрирование */
    }
</style>