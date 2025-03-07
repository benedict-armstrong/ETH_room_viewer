<script lang="ts">
	let { onSelect, initialService = 'printer' } = $props<{
		onSelect: (service: 'printer' | 'room') => void;
		initialService?: 'printer' | 'room';
	}>();

	let selected: 'printer' | 'room' = $state(initialService);

	function handleSelect(service: 'printer' | 'room') {
		selected = service;
		onSelect(service);
	}

	function handleKeydown(event: KeyboardEvent, service: 'printer' | 'room') {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleSelect(service);
		}
	}
</script>

<div class="flex flex-col space-y-4" role="group" aria-label="Service selection">
	<div class="my-2 grid h-16 grid-cols-2 gap-4">
		<button
			class="duration-DEFAULT rounded-lg text-center text-2xl font-black text-white transition-all focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-solid {selected ===
			'room'
				? 'bg-primary hover:bg-primary-light focus:bg-primary-light outline-primary'
				: 'bg-gray hover:bg-gray-light focus:bg-gray-light outline-gray'}"
			onclick={() => handleSelect('room')}
			onkeydown={(e) => handleKeydown(e, 'room')}
			aria-pressed={selected === 'room'}
			aria-label="Select room service"
			tabindex="0"
		>
			<span class="flex items-center justify-center gap-2">
				<i class="bi bi-door-open text-xl"></i>
				<span>Room</span>
			</span>
		</button>
		<button
			class="duration-DEFAULT rounded-lg text-center text-2xl font-black text-white transition-all focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-solid {selected ===
			'printer'
				? 'bg-primary hover:bg-primary-light focus:bg-primary-light outline-primary'
				: 'bg-gray hover:bg-gray-light focus:bg-gray-light outline-gray'}"
			onclick={() => handleSelect('printer')}
			onkeydown={(e) => handleKeydown(e, 'printer')}
			aria-pressed={selected === 'printer'}
			aria-label="Select printer service"
			tabindex="0"
		>
			<span class="flex items-center justify-center gap-2">
				<i class="bi bi-printer text-xl"></i>
				<span>Printer</span>
			</span>
		</button>
	</div>
</div>
