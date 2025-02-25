<script lang="ts">
	import { onMount, setContext, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	interface ScrollSelectProps {
		select: (selected: string | number | null) => void;
		class?: string;
		children: any;
	}

	let { children, select, ...props }: ScrollSelectProps = $props();

	// Expose a store for the currently selected value.
	const selected: Writable<string | number | null> = writable(null);
	// Provide context to child options.
	setContext('scroll-select', { selected });

	let container: HTMLDivElement;

	// Handle scrolling by determining which child is nearest to the center.
	function handleScroll(): void {
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const containerCenter = containerRect.top + container.clientHeight / 2;
		// Query all child elements with the "scroll-option" class.
		const itemElements = container.querySelectorAll<HTMLElement>('.scroll-option');

		let closest: HTMLElement | null = null;
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
				closest = el;
			}
			// Calculate a new opacity based on distance from the center.
			let newOpacity = 1 - distance / maxDistance;
			if (newOpacity < minOpacity) newOpacity = minOpacity;
			el.style.opacity = newOpacity.toString();
		});

		if (closest) {
			const newSelected = closest.getAttribute('data-value');
			selected.set(newSelected);
		}
	}

	function handleSelect(): void {
		select($selected);
	}

	// Optionally, you can also run the scroll logic on mount
	// to initialize the selection.
	onMount(() => {
		handleScroll();
	});
</script>

<div
	bind:this={container}
	onclick={() => handleSelect()}
	onkeydown={(e) => e.key === 'Enter' && handleSelect()}
	role="radiogroup"
	tabindex="0"
	class={['focus:outline-hidden h-full snap-y snap-mandatory overflow-y-scroll', props.class]}
	onscroll={handleScroll}
>
	<!-- add buffer so we can scroll to first an last element -->
	<!-- {#if open} -->
	<div class="h-[50%]"></div>
	{@render children?.()}
	<div class="h-[50%]"></div>
	<!-- {:else}
		<div>123 {$selected}</div>
	{/if} -->
</div>
