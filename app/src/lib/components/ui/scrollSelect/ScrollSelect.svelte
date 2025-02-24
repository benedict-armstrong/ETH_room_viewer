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

		itemElements.forEach((el) => {
			const rect = el.getBoundingClientRect();
			const elCenter = rect.top + rect.height / 2;
			const distance = Math.abs(elCenter - containerCenter);
			if (distance < minDistance) {
				minDistance = distance;
				closest = el;
			}
		});

		if (closest) {
			const newSelected = closest.getAttribute('data-value');
			selected.set(newSelected);
		}
	}

	// Optionally, you can also run the scroll logic on mount
	// to initialize the selection.
	onMount(() => {
		handleScroll();
	});
</script>

<!-- 
    The container uses Tailwind classes to enable vertical scrolling with snap behavior.
    Any additional classes passed to this component will be added (via Svelte’s attribute forwarding).
  -->
<div
	bind:this={container}
	onclick={() => select($selected)}
	onkeydown={(e) => e.key === 'Enter' && select($selected)}
	role="listbox"
	tabindex="0"
	class={['h-[80%] snap-y snap-mandatory overflow-y-scroll', props.class]}
	onscroll={handleScroll}
>
	<!-- add buffer so we can scroll to first an last element -->
	<div class="h-[50%]"></div>
	{@render children?.()}
	<div class="h-[50%]"></div>
</div>
