<script lang="js">
	import { fade, fly } from 'svelte/transition';

	let {
		value = '',
		options = [],
		onChange = (newValue) => {},
		planetNumber = 1,
		disabled = false,
		placeholder = 'Выберите планету...'
	} = $props();

	let isOpen = $state(false);
	let selectElement = $state(null);

	let selectedOptionLabel = $derived(options.find((opt) => opt.id === value)?.name ?? placeholder);

	function toggleDropdown() {
		if (disabled) return;
		isOpen = !isOpen;
	}

	function selectOption(optionId) {
		if (disabled) return;
		onChange(optionId);
		isOpen = false;
	}

	function handleKeydown(event) {
		if (disabled) return;
		switch (event.key) {
			case 'Escape':
				isOpen = false;
				break;
			case 'Enter':
			case ' ':
				break;
		}
	}

	function handleOptionKeydown(event, optionId) {
		if (disabled) return;
		switch (event.key) {
			case 'Enter':
			case ' ':
				event.preventDefault();
				selectOption(optionId);
				selectElement?.querySelector('button')?.focus();
				break;
		}
	}

	$effect(() => {
		function handleClickOutside(event) {
			if (isOpen && selectElement && !selectElement.contains(event.target)) {
				isOpen = false;
			}
		}

		if (isOpen && typeof window !== 'undefined') {
			setTimeout(() => {
				document.addEventListener('click', handleClickOutside, true);
			}, 0);
		}

		return () => {
			if (typeof window !== 'undefined') {
				document.removeEventListener('click', handleClickOutside, true);
			}
		};
	});
</script>

<div
	class:custom-select={true}
	class:is-open={isOpen}
	class:is-disabled={disabled}
	bind:this={selectElement}
>
	<button
		type="button"
		class="custom-select__button"
		onclick={toggleDropdown}
		onkeydown={handleKeydown}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		aria-controls={`planet-listbox-${planetNumber}`}
		aria-label={`Выбор планеты ${planetNumber}: ${selectedOptionLabel}`}
		{disabled}
		aria-disabled={disabled}
	>
		<span class="custom-select__selected-value">{selectedOptionLabel}</span>
		<span class="custom-select__arrow" aria-hidden="true">
			{#if isOpen}
				<svg
					width="18"
					height="11"
					viewBox="0 0 18 11"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g filter="url(#filter0_d_2034_70)">
						<path
							d="M0 10V7.5H2.5V5H5V2.5H7.5V0H10V2.5H12.5V5H15V7.5H17.5V10H12.5V7.5H10V5H7.5V7.5H5V10H0Z"
							fill="#020202"
						/>
						<path d="M12.5 7.5V10H5V7.5H7.5V5H10V7.5H12.5Z" fill="#020202" />
					</g>
					<defs>
						<filter
							id="filter0_d_2034_70"
							x="0"
							y="0"
							width="17.5"
							height="11"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="1" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix
								type="matrix"
								values="0 0 0 0 0.704167 0 0 0 0 0.617274 0 0 0 0 0.478247 0 0 0 1 0"
							/>
							<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2034_70" />
							<feBlend
								mode="normal"
								in="SourceGraphic"
								in2="effect1_dropShadow_2034_70"
								result="shape"
							/>
						</filter>
					</defs>
				</svg>
			{:else}
				<svg
					width="18"
					height="11"
					viewBox="0 0 18 11"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g filter="url(#filter0_d_2029_277)">
						<path
							d="M0.25 0V2.5H2.75V5H5.25V7.5H7.75V10H10.25V7.5H12.75V5H15.25V2.5H17.75V0H12.75V2.5H10.25V5H7.75V2.5H5.25V0H0.25Z"
							fill="#020202"
						/>
						<path d="M12.75 2.5V0H5.25V2.5H7.75V5H10.25V2.5H12.75Z" fill="#020202" />
					</g>
					<defs>
						<filter
							id="filter0_d_2029_277"
							x="0.25"
							y="0"
							width="17.5"
							height="11"
							filterUnits="userSpaceOnUse"
							color-interpolation-filters="sRGB"
						>
							<feFlood flood-opacity="0" result="BackgroundImageFix" />
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dy="1" />
							<feComposite in2="hardAlpha" operator="out" />
							<feColorMatrix
								type="matrix"
								values="0 0 0 0 0.704167 0 0 0 0 0.617274 0 0 0 0 0.478247 0 0 0 1 0"
							/>
							<feBlend
								mode="normal"
								in2="BackgroundImageFix"
								result="effect1_dropShadow_2029_277"
							/>
							<feBlend
								mode="normal"
								in="SourceGraphic"
								in2="effect1_dropShadow_2029_277"
								result="shape"
							/>
						</filter>
					</defs>
				</svg>
			{/if}
		</span>
	</button>

	{#if isOpen}
		<ul
			class="custom-select__dropdown"
			role="listbox"
			id={`planet-listbox-${planetNumber}`}
			tabindex="-1"
			in:fly={{ y: -10, duration: 200 }}
			out:fade={{ duration: 150 }}
		>
			{#each options as option, i (option.id)}
				<li
					class="custom-select__option"
					class:is-selected={option.id === value}
					role="option"
					aria-selected={option.id === value}
					tabindex="0"
					onclick={() => selectOption(option.id)}
					onkeydown={(e) => handleOptionKeydown(e, option.id)}
					data-value={option.id}
				>
					{#if option.id === value}
						<span class="custom-select__option-marker" aria-hidden="true">
							<svg
								class="custom-select__option-marker-icon"
								width="32"
								height="56"
								viewBox="0 0 32 56"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M0 0H8V8H16V16H24V24H32V32H24V40H16V48H8V56H0V40H8V32H16V24H8V16H0V0Z" />
							</svg>
						</span>
					{/if}
					{option.name}
				</li>
			{:else}
				<li
					class="custom-select__option is-disabled"
					role="option"
					aria-selected="false"
					aria-disabled="true"
				>
					Нет опций
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	.custom-select {
		position: relative;
		font-size: var(--font-size-select);
		letter-spacing: var(--font-ls-wide);
		line-height: var(--font-lh-base);
		min-width: 150px;
		width: 100%;
		max-width: 300px;
		border: 1px solid;
		border-image: linear-gradient(to right, var(--gradient-bronze-colors)) 1;
		font-family: var(--font-family-base);
	}

	.custom-select__button {
		letter-spacing: inherit;
		line-height: inherit;
		background: linear-gradient(to right, var(--gradient-prime-colors));
		color: transparent;
		background-clip: text;
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		width: 100%;
		text-align: left;
		cursor: pointer;
		transition: all var(--transition-time) ease-in-out;
	}

	.custom-select__selected-value {
		padding: 7.5px 10px 7.5px 20px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex-grow: 1;
	}

	.custom-select__arrow {
		width: 50px;
		background: linear-gradient(to bottom, var(--gradient-bronze-colors));
		display: grid;
		place-content: center;
		transition: all var(--transition-time) ease-in-out;
	}

	.custom-select__dropdown {
		position: absolute;
		top: calc(100% + 10px);
		left: 0;
		right: 0;
		background: rgb(from var(--color-background-base) r g b / 70%);
		border: 1px solid rgb(from var(--color-accent-primary) r g b / 50%);
		box-shadow: 0 0 5px rgb(from var(--color-accent-primary) r g b / 50%);
		backdrop-filter: blur(200px);
		padding: 15px;
		display: grid;
		gap: 10px;
		overflow-y: auto;
		max-height: 600px;
		z-index: 10;
	}

	.custom-select__option {
		cursor: pointer;
		color: var(--color-additional);
		display: flex;
		gap: 10px;
		transition: all var(--transition-time) ease-in-out;
	}

	.custom-select__option-marker {
		display: grid;
		place-content: center;
	}

	.custom-select__option-marker-icon {
		width: 6px;
		height: 10px;
		stroke: var(--color-accent-primary);
		fill: var(--color-accent-primary);
		filter: drop-shadow(-0.18px 0 1.79px rgb(from var(--color-accent-primary) r g b / 50%));
	}

	.custom-select__button:not(:disabled):focus-visible {
		outline: 2px solid var(--color-accent-primary);
	}

	.custom-select__button:not(:disabled):hover .custom-select__arrow,
	.custom-select__button:not(:disabled):focus-visible .custom-select__arrow {
		filter: brightness(0.9);
	}

	.custom-select__button:not(:disabled):active .custom-select__arrow {
		filter: brightness(0.75);
		transition-duration: 0.05s;
	}

	.custom-select__option.is-selected {
		color: var(--color-accent-prime);
	}

	.custom-select__option:not(.is-disabled):hover,
	.custom-select__option:focus-visible {
		color: var(--color-prime);
		outline: none;
	}

	.custom-select.is-disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.custom-select.is-disabled .custom-select__button {
		cursor: not-allowed;
		color: var(--color-text-muted);
		pointer-events: none;
	}

	.custom-select.is-disabled .custom-select__arrow {
		cursor: not-allowed;
		pointer-events: none;
	}

	.custom-select__option.is-disabled {
		color: var(--color-text-muted);
		cursor: not-allowed;
	}
</style>
