<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
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
		<div class="mt-8 text-center">
			<a
				href="/"
				class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Return Home
			</a>
		</div>
	</div>
</div>
