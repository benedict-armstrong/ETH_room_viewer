<script lang="ts">
	let message = 'Loading...';
	// wait 5 seconds then load the page
	setTimeout(() => {
		message = 'There was a problem loading the page, please try again later.';
	}, 5000);
</script>

<div class="text-center m-8">
	<svg
		class="w-16 h-16 -mt-1 inline mx-auto stroke-[#273F76]"
		width="100%"
		height="100%"
		viewBox="0 0 1000 1000"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		xml:space="preserve"
		style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"
	>
		<path
			id="path1"
			class="draw"
			d="M932,943.943L68,943.943L68,321.185L500,56.23L932,321.185"
			style="fill:none;stroke-width:44px;"
		/>
		<g transform="matrix(0.938396,0,0,0.833557,62.6719,123.771)">
			<rect
				x="107.447"
				y="328.009"
				width="717.181"
				height="564.758"
				style="fill:none;stroke-width:44px;"
			/>
		</g>
	</svg>
	<p class="m-4">{message}</p>
</div>

<style>
	.draw {
		stroke-dasharray: 2500;
		stroke-dashoffset: 2500;
		animation: dash2 2s ease infinite;
		-webkit-animation: dash2 2s ease infinite;
		animation-direction: alternate-reverse;
	}
	@keyframes dash2 {
		to {
			stroke-dashoffset: 0;
		}
	}

	@-webkit-keyframes dash2 {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
