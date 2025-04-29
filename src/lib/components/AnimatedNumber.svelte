<script>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    export let value = 0;
    export let duration = 500; // Длительность анимации в мс
    export let precision = 1; // Кол-во знаков после запятой (для массы, например)

    const animatedValue = tweened(value, {
        duration: duration,
        easing: cubicOut
    });

    // Реактивно обновляем tweened store при изменении пропа value
    $: animatedValue.set(value);

    // Форматирование числа
    $: formattedValue = $animatedValue.toLocaleString('ru-RU', {
         minimumFractionDigits: $animatedValue % 1 === 0 ? 0 : precision, // Не показывать .0
         maximumFractionDigits: precision
    });

</script>

<span>{formattedValue}</span>

<style>
    span {
        /* Можно добавить стили, если нужно */
        display: inline-block; /* Предотвращает "прыжки" ширины при анимации */
        min-width: 1.5em; /* Примерная минимальная ширина */
        text-align: inherit; /* Наследовать выравнивание от родителя */
    }
</style>