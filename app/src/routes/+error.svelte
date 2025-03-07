<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex min-h-[90vh] items-center justify-center">
	<div class="w-full max-w-md space-y-8 rounded-lg bg-white p-8">
		<div class="text-center">
			<h2 class="mt-6 text-3xl font-extrabold text-gray-900">Oops! Something went wrong</h2>
			<p class="mt-2 text-sm text-gray-600">
				We encountered an unexpected error. Please try again later.
			</p>
			{#if page.error?.message}
				<p class="mt-2 text-sm text-red-600">
					{page.status} - {page.error.message}
				</p>
			{/if}
		</div>
		<!-- Report a bug button -->
		<div class="text-center">
			<a
				href="https://github.com/benedict-armstrong/ETH_room_viewer/issues"
				class="bg-primary focus:ring-primary inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
			>
				Report a bug
			</a>
		</div>
	</div>
</div>
