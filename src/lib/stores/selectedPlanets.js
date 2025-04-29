// src/lib/stores/selectedPlanets.js
import { writable, derived } from 'svelte/store';
import { planetsById, planets } from '$lib/data/planets';

// ID первой и второй выбранной планеты
export const selectedPlanet1Id = writable(planets[0]?.id || null); // По умолчанию Марс
export const selectedPlanet2Id = writable(planets[1]?.id || null); // По умолчанию Нептун

// Производные сторы (derived stores) для получения полных данных о выбранных планетах
// Они автоматически обновляются при изменении selectedPlanet1Id или selectedPlanet2Id
export const selectedPlanet1 = derived(selectedPlanet1Id, ($id) => ($id ? planetsById[$id] : null));

export const selectedPlanet2 = derived(selectedPlanet2Id, ($id) => ($id ? planetsById[$id] : null));
