<script>
    import { planets } from '$lib/data/planets';
    import { createEventDispatcher } from 'svelte'; // 1. Import dispatcher

    export let value; // Changed from selectedId to 'value' for clarity, but you can keep selectedId
    export let planetNumber;
    export let options = [];

    const dispatch = createEventDispatcher(); // 2. Create dispatcher instance

    // 3. Function to dispatch the change event
    function handleChange(event) {
        dispatch('change', event.target.value); // Dispatch 'change' with the new value
    }
</script>

<select {value} on:change={handleChange} aria-label={`Выбор планеты ${planetNumber}`}>
    {#each options as planet}
        <option value={planet.id}>{planet.name}</option>
    {/each}
</select>

<style>
    select {
        padding: clamp(0.5em, 1vw, 0.8em) clamp(1em, 2vw, 1.5em);
        font-size: clamp(0.9rem, 2vw, 1.2rem);
        background-color: #222;
        color: var(--text-color);
        border: 1px solid #444;
        border-radius: 5px;
        cursor: pointer;
    }
</style>