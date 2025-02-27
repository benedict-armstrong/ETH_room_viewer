<script lang="ts">
	let { onSelect } = $props<{
		onSelect: (service: 'printer' | 'room') => void;
	}>();

	let selected: 'printer' | 'room' | null = $state(null);

	function handleSelect(service: 'printer' | 'room') {
		selected = service;
		onSelect(service);
	}
</script>

<div class="flex flex-col space-y-4">
	<div class="my-2 grid h-20 grid-cols-2 gap-4">
		<button
			class="bg-primary outline-primary duration-DEFAULT hover:bg-primary-light rounded-lg text-center text-2xl font-black text-white transition-all focus:outline-2 focus:outline-offset-2 {selected ===
			'printer'
				? 'ring-primary-light/50 ring-4'
				: ''}"
			onclick={() => handleSelect('printer')}
		>
			Find Printer
		</button>
		<button
			class="bg-accent outline-accent duration-DEFAULT hover:bg-accent-light rounded-lg text-center text-2xl font-black text-white transition-all focus:outline-2 focus:outline-offset-2 {selected ===
			'room'
				? 'ring-accent-light/50 ring-4'
				: ''}"
			onclick={() => handleSelect('room')}
		>
			Find Room
		</button>
	</div>
</div>
