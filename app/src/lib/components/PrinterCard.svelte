<script lang="ts">
	import type { PrinterWithStatus } from '../../routes/printers/[building]/[floor]/+page.server';

	let { printer }: { printer: PrinterWithStatus } = $props();
</script>

<div
	class="flex cursor-pointer flex-col justify-between rounded-lg border-2 border-gray-200 bg-white p-4 shadow-sm transition-all"
>
	<div>
		<div class="flex items-center justify-between">
			<h3 class="text-xl font-semibold text-gray-800">
				{printer.building}
				{printer.floor}
				{printer.room}
			</h3>
			<div class="flex items-center gap-2">
				<span class="text-primary rounded-full px-3 py-1 text-sm font-medium">
					{printer.type}
				</span>
			</div>
		</div>
	</div>
</div>
