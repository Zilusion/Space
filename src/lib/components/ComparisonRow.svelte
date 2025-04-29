<script>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing'; // Пример easing-функции
    import AnimatedNumber from './AnimatedNumber.svelte';

    export let label;
    export let unit;
    export let value1;
    export let value2;
    export let isTemperature = false; // Особая логика для знака сравнения температуры

    $: comparisonSymbol = value1 === value2 ? '=' : (value1 > value2 ? '>' : '<');
    $: comparisonSymbolTemp = value1 === value2 ? '=' : (value1 < value2 ? '>' : '<'); // Для температуры - чем *меньше*, тем "больше" (холоднее)

    $: finalSymbol = isTemperature ? comparisonSymbolTemp : comparisonSymbol;

    // Анимация символа (пример - можно усложнить)
    const symbolOpacity = tweened(0, { duration: 100, easing: cubicOut });
    const symbolScale = tweened(0.5, { duration: 300, easing: cubicOut });

    // Реактивно запускаем анимацию при смене символа
    $: {
        symbolOpacity.set(0).then(() => symbolOpacity.set(1));
        symbolScale.set(0.5).then(() => symbolScale.set(1));
        // Мы "передергиваем" tween, чтобы анимация запускалась каждый раз
        // при изменении finalSymbol, даже если он меняется на тот же самый
        // при быстрой смене планет. Переменная finalSymbol должна быть
        // в $: блоке, чтобы Svelte отслеживал ее изменения.
        const _trigger = finalSymbol;
    }

</script>

<div class="row">
    <div class="value value1">
        <AnimatedNumber value={value1} />
    </div>
    <div class="label-container">
        <span class="label">{label}</span>
        {#if unit}<span class="unit">{unit}</span>{/if}
        <span
            class="symbol"
            style="opacity: {$symbolOpacity}; transform: scale({$symbolScale});"
        >
            {finalSymbol}
        </span>
    </div>
    <div class="value value2">
        <AnimatedNumber value={value2} />
    </div>
</div>

<style>
    .row {
        display: grid;
        grid-template-columns: 1fr auto 1fr; /* Значение1 | Метка+Символ | Значение2 */
        align-items: center;
        text-align: center;
        gap: clamp(0.5rem, 2vw, 1.5rem);
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
    }
     .value1 { text-align: right; }
     .value2 { text-align: left; }

    .symbol {
        font-size: clamp(1.2rem, 3vw, 2rem);
        color: #facc15; /* Yellowish */
        font-weight: bold;
        display: inline-block; /* Для transform */
        min-width: 1em; /* Чтобы не прыгало при смене символа */
    }
</style>