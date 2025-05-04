<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut, cubicIn, linear } from 'svelte/easing';
	import { base } from '$app/paths';
	import { onDestroy } from 'svelte';

	let { gravityValue = 1 } = $props();

	const BASE_JUMP_HEIGHT_PX = 80;
	const MIN_GRAVITY = 0.1; 
	const MAX_JUMP_HEIGHT_PX = BASE_JUMP_HEIGHT_PX / MIN_GRAVITY;

	let isHovering = $state(false);
	let isAnimating = $state(false);
	let timeoutId = null; 

	let jumpHeight = $derived(
		BASE_JUMP_HEIGHT_PX / Math.max(MIN_GRAVITY, gravityValue || MIN_GRAVITY)
	);
	let cappedJumpHeight = $derived(Math.min(jumpHeight, MAX_JUMP_HEIGHT_PX));

	const jumperY = tweened(0, { duration: 400, easing: cubicOut }); 

	async function performJumpCycle() {
		if (!isHovering || !isAnimating) {
			if ($jumperY !== 0) {
				await jumperY.set(0, { duration: 150, easing: cubicOut });
			}
			isAnimating = false;
			return;
		}

		try {
			await jumperY.set(-cappedJumpHeight, { duration: 400, easing: cubicOut });

			if (!isHovering || !isAnimating) {
				if ($jumperY !== 0) await jumperY.set(0, { duration: 50 });
				isAnimating = false;
				return;
			}

			await jumperY.set(0, { duration: 350, easing: cubicIn });

			if (!isHovering || !isAnimating) {
				isAnimating = false;
				return;
			}

			timeoutId = setTimeout(performJumpCycle, 300);
		} catch (e) {
			console.error('Animation error:', e);
			isAnimating = false;
		}
	}

	$effect(() => {
		if (isHovering) {
			if (!isAnimating) {
				isAnimating = true;
				clearTimeout(timeoutId);
				timeoutId = setTimeout(performJumpCycle, 50);
			}
		} else {
			if (isAnimating) {
				isAnimating = false;
				clearTimeout(timeoutId);
				if ($jumperY !== 0) {
					jumperY.set(0, { duration: 150, easing: cubicOut });
				}
			}
		}
	});

	$effect(() => {
		const currentHoverState = isHovering;

		isAnimating = false;
		clearTimeout(timeoutId);

		jumperY.set(0, { duration: 50 });

		if (currentHoverState) {
			timeoutId = setTimeout(() => {
				if (isHovering) {
					isAnimating = true;
					performJumpCycle();
				}
			}, 100);
		}
		const _trigger = cappedJumpHeight;
	});

	onDestroy(() => {
		isAnimating = false;
		clearTimeout(timeoutId);
	});
</script>

<div
	role="button"
	class="jump-container"
	title={`Гравитация: ${gravityValue}g`}
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
	onfocusin={() => (isHovering = true)}
	onfocusout={() => (isHovering = false)}
	tabindex="0"
>
	<div class="ground"></div>
	<div class="jumper" style="transform: translateY({$jumperY}px);">
		<svg viewBox="-100 -21 682 682.66669" xmlns="http://www.w3.org/2000/svg"
			><path
				d="m235.910156 150.449219c41.476563 0 75.222656-33.746094 75.222656-75.222657 0-41.480468-33.746093-75.226562-75.222656-75.226562-41.480468 0-75.226562 33.746094-75.226562 75.226562 0 41.476563 33.746094 75.222657 75.226562 75.222657zm0-100.296875c13.820313 0 25.070313 11.246094 25.070313 25.074218 0 13.820313-11.25 25.070313-25.070313 25.070313-13.828125 0-25.074218-11.25-25.074218-25.070313 0-13.828124 11.246093-25.074218 25.074218-25.074218zm75.222656 169.582031 165.601563-164.324219-35.324219-35.597656-155.652344 154.453125h-99.699218l-155.652344-154.453125-35.324219 35.597656 165.601563 164.324219v276.742187h-126.625v50.148438h176.777344v-130.390625h56.621093l38.027344 97.507813-94.394531 89.953124 34.59375 36.304688 118.742187-113.148438-53.292969-136.640624zm-50.152343 146.355469h-50.144531v-141.671875h50.144531zm0 0"
				fill="#000000"
				style="fill: rgb(255, 255, 255);"
			></path></svg
		>
	</div>
	<div class="height-indicator" style="height: {cappedJumpHeight}px;"></div>
</div>

<style lang="scss">
	.jump-container {
		position: relative;
		width: 50px;
		height: 100px;
		margin: 0 auto; 
	}

	.ground {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 5px;
		background: var(--color-accent-prime);
		border-radius: 2px;
	}

	.jumper {
		position: absolute;
		bottom: 5px;
		left: 50%;
		transform: translateX(-50%);
		width: 24px;
		height: 24px;
		will-change: transform;
	}

	.height-indicator {
		position: absolute;
		bottom: 5px;
		left: 5px;
		width: 2px;
		background: var(--color-accent-primary);
		border-radius: 1px;
		transition: height 0.3s ease-out;
		pointer-events: none;
	}
</style>
