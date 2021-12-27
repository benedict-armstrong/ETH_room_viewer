<script>
	import Head from '../components/head.svelte';

	import '../app.css';

	import Nav from '../components/nav.svelte';
</script>

<Head />
<Nav />

<div class="p-8 pt-16 max-w-6xl mx-auto">
	<slot />
</div>
