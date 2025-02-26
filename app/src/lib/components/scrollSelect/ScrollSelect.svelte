<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	interface ScrollSelectProps {
		select: (selected: string | number | null) => void;
		class?: string;
		initialValue?: string | number | null;
		children: any;
	}

	let { children, select, initialValue = null, ...props }: ScrollSelectProps = $props();

	// Expose a store for the currently selected value.
	const selected: Writable<string | number | null> = writable(initialValue);
	// Provide context to child options.
	setContext('scroll-select', { selected });

	let container: HTMLDivElement;
	let searchString = '';
	let searchTimeout: number | null = null;

	// Handle scrolling by determining which child is nearest to the center.
	function handleScroll(): void {
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const containerCenter = containerRect.top + container.clientHeight / 2;
		// Query all child elements with the "scroll-option" class.
		const itemElements = container.querySelectorAll<HTMLElement>('.scroll-option');

		let closestElement: HTMLElement | null = null;
		let minDistance = Infinity;
		const maxDistance = container.clientHeight / 2;
		const minOpacity = 0.25;

		itemElements.forEach((el) => {
			const rect = el.getBoundingClientRect();
			const elCenter = rect.top + rect.height / 2;
			const distance = Math.abs(elCenter - containerCenter);
			// Determine which element is closest to the center.
			if (distance < minDistance) {
				minDistance = distance;
				closestElement = el;
			}
			// Calculate a new opacity based on distance from the center.
			let newOpacity = 1 - distance / maxDistance;
			if (newOpacity < minOpacity) newOpacity = minOpacity;
			el.style.opacity = newOpacity.toString();
		});

		if (closestElement) {
			const newSelected = (closestElement as HTMLElement).getAttribute('data-value');
			selected.set(newSelected);
		}
	}

	function handleSelect(): void {
		select($selected);
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key.length === 1 && /[a-zA-Z0-9]/.test(event.key)) {
			// Add the pressed key to the search string
			searchString += event.key.toLowerCase();

			// Reset the search string after 1 second of no input
			if (searchTimeout) clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => {
				searchString = '';
			}, 300);

			// Find the first option that starts with the search string
			const options = container?.querySelectorAll<HTMLElement>('.scroll-option');
			if (options) {
				for (let i = 0; i < options.length; i++) {
					const option = options[i];
					const value = option.getAttribute('data-value');
					if (value?.toLowerCase().startsWith(searchString)) {
						// Scroll the option into view
						option.scrollIntoView({ behavior: 'smooth', block: 'center' });
						break;
					}
				}
			}
		}
	}

	// Optionally, you can also run the scroll logic on mount
	// to initialize the selection.
	onMount(() => {
		handleScroll();

		// If we have an initial value, scroll to that option
		if (initialValue) {
			const options = container?.querySelectorAll<HTMLElement>('.scroll-option');
			if (options) {
				for (let i = 0; i < options.length; i++) {
					const option = options[i];
					if (option.getAttribute('data-value') === initialValue) {
						// Scroll the option into view
						option.scrollIntoView({ behavior: 'auto', block: 'center' });
						break;
					}
				}
			}
		}
	});
</script>

<div
	bind:this={container}
	onclick={() => handleSelect()}
	onkeydown={(e) => {
		handleKeydown(e);
		if (e.key === 'Enter') handleSelect();
	}}
	role="radiogroup"
	tabindex="0"
	class={['h-full snap-y snap-mandatory overflow-y-scroll focus:outline-hidden', props.class]}
	onscroll={handleScroll}
>
	<!-- add buffer so we can scroll to first an last element -->
	<div class="h-[50%]"></div>
	{@render children?.()}
	<div class="h-[50%]"></div>
</div>
