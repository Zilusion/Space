<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing'; // Пример easing-функции
	import AnimatedNumber from './AnimatedNumber.svelte';

	export let label;
	export let unit;
	export let value1;
	export let value2;
	export let isTemperature = false; // Особая логика для знака сравнения температуры
	export let p1;
	export let p2;

	$: comparisonSymbol = value1 === value2 ? '=' : value1 > value2 ? '>' : '<';
	$: comparisonSymbolTemp = value1 === value2 ? '=' : value1 < value2 ? '>' : '<'; // Для температуры - чем *меньше*, тем "больше" (холоднее)

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

	$: planet1DiameterPx = 100 + (p1?.diameter || 0) / 1000;
	$: planet2DiameterPx = 100 + (p2?.diameter || 0) / 1000;

	$: earthCount1 = Math.floor(p1?.mass || 0);
	$: earthCount2 = Math.floor(p2?.mass || 0);

	function getTemperatureEmoji(temp) {
		if (temp === null || temp === undefined) return '';
		if (temp >= 200) return '☠️🔥';
		if (temp >= 40) return '🥵';
		if (temp >= -60) return '😎';
		if (temp > -65) return '🥶';
		return '💀❄️';
	}

	$: emoji1 = getTemperatureEmoji(p1?.temperature);
	$: emoji2 = getTemperatureEmoji(p2?.temperature);

	// --- ВЫЧИСЛЕНИЯ ДЛЯ ОРБИТЫ ---
	const MAX_ORBIT = 4500; // Примерное макс. расстояние Нептуна в млн км
	const ORBIT_VIZ_WIDTH_FACTOR = 0.45; // Доля ширины контейнера под орбиту (оставляем место для метки)

	// Размер планеты на схеме орбиты (основан на диаметре, но сильно уменьшен)
	function getOrbitPlanetSize(diameter) {
		if (!diameter) return 5; // Минимальный размер
		// Пример: Земля (12742) -> ~15px, Юпитер (139820) -> ~30px
		return Math.max(5, Math.min(30, 5 + diameter / 5000)); // Формула для масштабирования, можно подбирать
	}
	$: orbitPlanetSize1 = getOrbitPlanetSize(p1?.diameter);
	$: orbitPlanetSize2 = getOrbitPlanetSize(p2?.diameter);

	// Позиция планеты (процент от ширины контейнера)
	// (p.orbit / MAX_ORBIT) дает долю от 0 до 1
	// Умножаем на 100 для процентов
	$: orbitPositionPercent1 = ((p1?.orbit || 0) / MAX_ORBIT) * 100;
	$: orbitPositionPercent2 = ((p2?.orbit || 0) / MAX_ORBIT) * 100;
</script>

<div class="row">
	<div class="value value1">
		{#if label === 'ДИАМЕТР'}
			<div class="diametr-viz-container">
				<img
					src={`/images/space/${p1.id}.png`}
					alt={p1.name}
					class="planet-viz planet-diameter"
					style="width: {planet1DiameterPx}px; height: {planet1DiameterPx}px;"
					title={`Диаметр: ${p1.diameter.toLocaleString('ru-RU')} км`}
				/>
			</div>
		{:else if label === 'МАССА'}
			<div class="mass-viz-container">
				{#each Array(earthCount1) as _, i (i)}
					<img
						src="/images/space/earth.png"
						alt="Earth mass unit"
						class="earth-mass-unit"
						title={`Масса ~ ${earthCount1} Земель`}
					/>
				{/each}
			</div>
		{:else if label === 'ТЕМПЕРАТУРА'}
			<span class="temp-emoji">{emoji1}</span>
		{/if}
		<AnimatedNumber value={value1} />
	</div>
	<div class="label-container">
		<span class="label">{label}</span>
		{#if unit}<span class="unit">{unit}</span>{/if}
		<span class="symbol" style="opacity: {$symbolOpacity}; transform: scale({$symbolScale});">
			{finalSymbol}
		</span>
	</div>
	<div class="value value2">
		{#if label === 'ДИАМЕТР'}
			<div class="diametr-viz-container">
				<img
					src={`/images/space/${p2.id}.png`}
					alt={p2.name}
					class="planet-viz planet-diameter"
					style="width: {planet2DiameterPx}px; height: {planet2DiameterPx}px;"
					title={`Диаметр: ${p2.diameter.toLocaleString('ru-RU')} км`}
				/>
			</div>
		{:else if label === 'МАССА'}
			<div class="mass-viz-container">
				{#each Array(earthCount2) as _, i (i)}
					<img
						src="/images/space/earth.png"
						alt="Earth mass unit"
						class="earth-mass-unit"
						title={`Масса ~ ${earthCount2} Земель`}
					/>
				{/each}
			</div>
		{:else if label === 'ТЕМПЕРАТУРА'}
			<span class="temp-emoji">{emoji2}</span>
		{/if}
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
		display: flex; /* Для управления содержимым */
		flex-direction: column; /* По умолчанию ставим в колонку */
		align-items: center; /* Центрируем по горизонтали */
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
		color: #facc15; /* Yellowish */
		font-weight: bold;
		display: inline-block; /* Для transform */
		min-width: 1em; /* Чтобы не прыгало при смене символа */
	}

	.planet-viz {
		display: block;
		object-fit: contain; /* Чтобы картинка вписывалась */
		margin: 5px 0; /* Небольшой отступ */
	}

	.planet-diameter {
		/* max-width: 150px; */
		/* max-height: 150px; */
	}

	.mass-viz-container {
		display: flex; /* Ставим Земли в ряд */
		flex-wrap: wrap; /* Разрешаем перенос на новую строку */
		justify-content: center; /* Центрируем Земли */
		margin-bottom: 5px; /* Отступ снизу */
		max-width: 120px; /* Ограничим ширину контейнера */
		align-self: center; /* Центрируем контейнер в value блоке */
	}
	.value1 .mass-viz-container {
		justify-content: flex-end;
	} /* Выравнивание для левого блока */
	.value2 .mass-viz-container {
		justify-content: flex-start;
	} /* Выравнивание для правого блока */

	.earth-mass-unit {
		width: clamp(12px, 2vw, 18px); /* Маленький размер Земли */
		height: clamp(12px, 2vw, 18px);
		margin: 1px; /* Небольшой отступ между Землями */
	}

	.temp-emoji {
		font-size: clamp(1.2rem, 3vw, 1.8rem); /* Размер emoji */
		line-height: 1; /* Убираем лишнюю высоту строки */
	}
</style>
