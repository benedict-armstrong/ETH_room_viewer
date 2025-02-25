<script lang="ts">
	import { onMount } from 'svelte';
	import ScrollSelect from './scrollSelect/ScrollSelect.svelte';
	import ScrollSelectOption from './scrollSelect/ScrollSelectOption.svelte';

	let { select, data } = $props();
	let selected: string | undefined = $state();
	let open = $state(false);

	function formatDistance(distance: number) {
		if (distance < 1000) {
			return `${distance} m`;
		} else {
			const km = distance / 1000;
			return `${km.toFixed(1)} km`;
		}
	}

	function handleSelect(new_selected: string | number | null) {
		open = false;
		select(new_selected);
		selected = new_selected as string;
	}

	onMount(() => {
		if (!selected) {
			open = true;
		}
	});
</script>

<div
	class={[
		'focus-within:outline-solid m-3 rounded-lg bg-blue-600 outline-blue-600 focus-within:outline-2 focus-within:outline-offset-2',
		open && 'h-[500px]',
		!open && 'h-[70px]'
	]}
>
	{#if open}
		<div class="flex h-full flex-col">
			<div class="grow-0">
				<h2 class="m-4 text-2xl font-black text-white">Select Building:</h2>
			</div>
			<ScrollSelect select={handleSelect}>
				<!-- <ScrollSelectOption value="Option1">Option1</ScrollSelectOption> -->
				{#each data.buildings as building}
					<ScrollSelectOption
						value={building.building}
						class="flex h-12 items-center justify-center font-black"
						selectedClass="text-white text-4xl"
						notSelectedClass="text-gray-300 text-2xl opacity-80"
					>
						<div class="relative">
							<div>
								{building.building}
							</div>
							{#if building.distance}
								<div class="w-30 absolute left-20 top-[50%] ml-3 text-[0.7rem] text-gray-200">
									{formatDistance(building.distance)}
								</div>
							{/if}
						</div>
					</ScrollSelectOption>
				{/each}
			</ScrollSelect>
			<div class="grow-0">
				<p class="m-2 text-right text-xs font-bold text-white md:text-sm">
					enter or click to select
				</p>
			</div>
		</div>
	{:else}
		<div
			class="flex h-full items-center justify-center text-4xl font-black text-white"
			tabindex="0"
			onclick={() => (open = true)}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					// set focus to the option box
					open = true;
				}
			}}
			role="button"
		>
			<div class="grow-0">
				<h2 class="m-4 text-2xl font-black text-white">Building:</h2>
			</div>
			<div>{selected}</div>
		</div>
	{/if}
</div>
