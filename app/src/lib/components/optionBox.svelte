<script lang="ts">
	import { onMount } from 'svelte';
	import ScrollSelect from './scrollSelect/ScrollSelect.svelte';

	// Simplified props
	let {
		select,
		title = 'Select Option:',
		selectedLabel = 'Selected:',
		initialValue = undefined,
		disabled = false,
		class: className,
		...props
	} = $props();

	let selected: string | undefined = $state(initialValue);
	let open = $state(false);
	let optionBoxElement: HTMLDivElement;

	function handleSelect(new_selected: string | number | null) {
		open = false;
		select(new_selected);
		selected = new_selected as string;
	}

	function openSelection() {
		if (disabled) return;

		open = true;
		// Use setTimeout to ensure the DOM has updated before trying to focus
		setTimeout(() => {
			// Find and focus the ScrollSelect container when opened
			const scrollSelectElement = optionBoxElement?.querySelector('[role="radiogroup"]');
			if (scrollSelectElement instanceof HTMLElement) {
				scrollSelectElement.focus();
			}
		}, 10);
	}

	onMount(() => {
		if (!disabled && initialValue) {
			selected = initialValue;
		}
	});

	// Update selected value when initialValue changes
	$effect(() => {
		if (initialValue !== undefined) {
			selected = initialValue;
		}
	});
</script>

<div
	bind:this={optionBoxElement}
	class={[
		className,
		open && 'h-[500px]',
		!open && 'h-[70px]',
		disabled && 'cursor-not-allowed opacity-60'
	]}
>
	{#if open}
		<div class="flex h-full flex-col">
			<div class="grow-0">
				<h2 class="m-4 text-2xl font-black text-white">{title}</h2>
			</div>
			<ScrollSelect select={handleSelect} initialValue={selected}>
				{@render props.children?.()}
			</ScrollSelect>
			<div class="grow-0">
				<p class="m-2 text-right text-xs font-bold text-white md:text-sm">
					Enter or click to select
				</p>
			</div>
		</div>
	{:else}
		<div
			class="flex h-full items-center justify-center text-4xl font-black text-white"
			tabindex={disabled ? -1 : 0}
			onclick={openSelection}
			onkeydown={(e) => {
				if (e.key === 'Enter' && !disabled) openSelection();
			}}
			role="button"
			aria-disabled={disabled}
			aria-haspopup="listbox"
			aria-expanded={open}
		>
			<div class="grow-0">
				<h2 class="m-4 text-2xl font-black text-white">{selectedLabel}</h2>
			</div>
			{#if selected}
				<div>{selected}</div>
			{:else}
				<div class="m-4 text-2xl font-black text-white">-</div>
			{/if}
		</div>
	{/if}
</div>
