<script lang="ts">
	import type { PageData } from './$types';
	import PrinterCard from '$lib/components/PrinterCard.svelte';

	let { data }: { data: PageData } = $props();

	// Group printers by floor
	let printersByFloor = $derived(
		data.printers.reduce(
			(acc, printer) => {
				if (!acc[printer.floor]) {
					acc[printer.floor] = [];
				}
				acc[printer.floor].push(printer);
				return acc;
			},
			{} as Record<string, typeof data.printers>
		)
	);

	// Get floor numbers (order is preserved from server-side sorting)
	let floors = $derived(Object.keys(printersByFloor));

	// Selected floor from the first printer
	let selectedFloor = $derived(data.printers[0]?.floor || '');
</script>

<div class="container mx-auto p-4">
	<div class="mb-6 flex items-center justify-between">
		<a
			href={`/?building=${data.printers[0]?.building}&floor=${data.printers[0]?.floor}`}
			class="hover:text-accent ml-2 flex items-center gap-1 text-gray-600 hover:underline"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
					clip-rule="evenodd"
				/>
			</svg>
			<span>Back to buildings</span>
		</a>
	</div>

	<h1 class="text-primary mb-6 text-3xl font-bold">{data.printers[0]?.building || ''}</h1>

	{#each floors as floor}
		<div class="mb-8">
			<h2 class="text-primary mb-4 text-2xl font-semibold">Floor {floor}</h2>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each printersByFloor[floor] as printer}
					<PrinterCard {printer} />
				{/each}
			</div>
		</div>
	{/each}
</div>
