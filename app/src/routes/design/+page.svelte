<script lang="ts">
	import { designSystem } from '$lib/design-system';
</script>

<div class="mx-auto max-w-4xl rounded-lg p-8">
	<h1 class="mb-8 text-4xl font-black">Design System</h1>

	<!-- Colors -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-bold">Colors</h2>

		<div class="space-y-8">
			<!-- Brand Colors -->
			<div>
				<h3 class="mb-2 text-xl font-semibold">Brand Colors</h3>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
					<div class="space-y-2">
						<div class="bg-primary h-20 rounded-md">
							<p class="text-sm font-medium">Primary</p>
							<p class="font-mono text-xs text-gray-500">{designSystem.colors.primary.DEFAULT}</p>
						</div>
					</div>
					<div class="space-y-2">
						<div class="bg-primary-light h-20 rounded-md">
							<p class="text-sm font-medium">Primary Light</p>
							<p class="font-mono text-xs text-gray-500">{designSystem.colors.primary.light}</p>
						</div>
					</div>
					<div class="space-y-2">
						<div class="bg-secondary h-20 rounded-md">
							<p class="text-sm font-medium">Secondary</p>
							<p class="font-mono text-xs text-gray-500">{designSystem.colors.secondary.DEFAULT}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Status Colors -->
			<div>
				<h3 class="mb-2 text-xl font-semibold">Status Colors</h3>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div class="space-y-2">
						<div class="bg-success h-20 rounded-md">
							<p class="text-sm font-medium">Success</p>
							<p class="font-mono text-xs text-gray-500">{designSystem.colors.success.DEFAULT}</p>
						</div>
					</div>
					<div class="space-y-2">
						<div class="bg-warning h-20 rounded-md">
							<p class="text-sm font-medium">Warning</p>
							<p class="font-mono text-xs text-gray-500">{designSystem.colors.warning.DEFAULT}</p>
						</div>
					</div>
					<div class="space-y-2">
						<div class="bg-error h-20 rounded-md">
							<p class="text-sm font-medium">Error</p>
							<p class="font-mono text-xs text-gray-500">{designSystem.colors.error.DEFAULT}</p>
						</div>
					</div>
					<div class="space-y-2">
						<div class="bg-info h-20 rounded-md">
							<p class="text-sm font-medium">Info</p>
							<p class="font-mono text-xs text-gray-500">{designSystem.colors.info.DEFAULT}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Gray Scale -->
			<div>
				<h3 class="mb-2 text-xl font-semibold">Gray Scale</h3>
				<div class="grid grid-cols-5 gap-4">
					{#each Object.entries(designSystem.colors.gray) as [key, value]}
						<div class="space-y-2">
							<div class="h-20 rounded-md" style="background-color: {value}">
								<p class="text-sm font-medium">Gray {key}</p>
								<p class="font-mono text-xs text-gray-500">{value}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Typography -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-bold">Typography</h2>

		<div class="space-y-8">
			<!-- Font Sizes -->
			<div>
				<h3 class="mb-2 text-xl font-semibold">Font Sizes</h3>
				<div class="space-y-4">
					{#each Object.entries(designSystem.typography.fontSize) as [key, [size]]}
						<div class="flex items-baseline justify-between border-b border-gray-200 pb-2">
							<p style="font-size: {size}">The quick brown fox jumps over the lazy dog</p>
							<div class="ml-4 text-right">
								<p class="text-sm font-medium">{key}</p>
								<p class="font-mono text-xs text-gray-500">{size}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Font Weights -->
			<div>
				<h3 class="mb-2 text-xl font-semibold">Font Weights</h3>
				<div class="space-y-4">
					{#each Object.entries(designSystem.typography.fontWeight) as [key, weight]}
						<div class="flex items-baseline justify-between border-b border-gray-200 pb-2">
							<p style="font-weight: {weight}">The quick brown fox jumps over the lazy dog</p>
							<div class="ml-4 text-right">
								<p class="text-sm font-medium">{key}</p>
								<p class="font-mono text-xs text-gray-500">{weight}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Spacing -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-bold">Spacing</h2>
		<div class="space-y-4">
			{#each Object.entries(designSystem.spacing) as [key, value]}
				<div class="flex items-center space-x-4">
					<div class="bg-primary h-8" style="width: {value}">
						<div>
							<p class="text-sm font-medium">{key}</p>
							<p class="font-mono text-xs text-gray-500">{value}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Border Radius -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-bold">Border Radius</h2>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			{#each Object.entries(designSystem.borderRadius) as [key, value]}
				<div class="space-y-2">
					<div class="bg-primary h-20 w-full" style="border-radius: {value}">
						<p class="text-sm font-medium">{key}</p>
						<p class="font-mono text-xs text-gray-500">{value}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Shadows -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-bold">Shadows</h2>
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
			{#each Object.entries(designSystem.shadows) as [key, value]}
				<div class="space-y-2">
					<div class="h-20 w-full rounded-lg bg-white" style="box-shadow: {value}">
						<p class="text-sm font-medium">{key}</p>
						<p class="font-mono text-xs break-words text-gray-500">{value}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Animations -->
	<section class="mb-12">
		<h2 class="mb-4 text-2xl font-bold">Animations</h2>

		<!-- Durations -->
		<div class="mb-8">
			<h3 class="mb-2 text-xl font-semibold">Durations</h3>
			<div class="grid grid-cols-3 gap-4">
				{#each Object.entries(designSystem.animation.durations) as [key, duration]}
					<div class="space-y-2">
						<div
							class="bg-primary h-12 w-12 rounded-md hover:translate-x-4"
							style="transition-duration: {duration}"
						>
							<p class="text-sm font-medium">{key}</p>
							<p class="font-mono text-xs text-gray-500">{duration}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Timing Functions -->
		<div>
			<h3 class="mb-2 text-xl font-semibold">Timing Functions</h3>
			<div class="grid grid-cols-3 gap-4">
				{#each Object.entries(designSystem.animation.timingFunctions) as [key, timing]}
					<div class="space-y-2">
						<div
							class="bg-primary h-12 w-12 rounded-md hover:translate-x-4"
							style="transition-timing-function: {timing}; transition-duration: 1000ms"
						>
							<p class="text-sm font-medium">{key}</p>
							<p class="font-mono text-xs break-words text-gray-500">{timing}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>
