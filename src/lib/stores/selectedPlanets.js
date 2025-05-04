import { writable, derived } from 'svelte/store';
import { planetsById, planets } from '$lib/data/planets';

export const selectedPlanet1Id = writable(planets[0]?.id || null);
export const selectedPlanet2Id = writable(planets[1]?.id || null);

export const selectedPlanet1 = derived(selectedPlanet1Id, ($id) => ($id ? planetsById[$id] : null));

export const selectedPlanet2 = derived(selectedPlanet2Id, ($id) => ($id ? planetsById[$id] : null));
