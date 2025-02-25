<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let { value, selectedClass = '', notSelectedClass = '', ...props } = $props();

	// Retrieve the selection store from context.
	const { selected } = getContext('scroll-select') as {
		selected: Writable<string | number | null>;
	};

	let isSelected = $state(false);

	// Subscribe to the store to update whether this option is selected.
	selected.subscribe((val) => {
		isSelected = val == value;
	});
</script>

<!-- 
    The "scroll-option" class is used by the parent to query these elements.
    The data-value attribute holds the option's value.
    Tailwind classes handle sizing, centering, and styling.
    Conditional classes highlight the selected option.
  -->
<div
	class={[
		'scroll-option snap-center',
		props.class,
		isSelected && selectedClass,
		!isSelected && notSelectedClass
	]}
	data-value={value}
	role="radio"
	aria-checked={isSelected}
>
	{@render props.children?.()}
</div>
