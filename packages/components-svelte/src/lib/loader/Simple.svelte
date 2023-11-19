<script lang="ts">
	import { onMount } from "svelte";

	/**
	 * Loader
	 * @see https://www.npmjs.com/package/vue-spinner
	 * The original one didn't allow to change the animation speed and it was too fast
	 *
	 * @component
	 * @example
	 * <Loader></Loader>
	 */

	/** @props Loader label */
	export let label: string;
	/** @props Hide label */
	export let hideLabel = false;
	/** @props Background color */
	export let color = "#0f47af";
	/** @props Dimensions */
	export let size = "0.5rem";
	/** @props Margin */
	export let margin = "2px";
	/** @props Border radius */
	export let radius = "100%";
	/** @props Animation speed in ms */
	export let speed = 1000;

	let firstPulse: HTMLElement;
	let secondPulse: HTMLElement;
	let thirdPulse: HTMLElement;

	$: spinnerStyle = `
		background-color: ${color};
		width: ${size};
		height: ${size};
		margin: ${margin};
		border-radius: ${radius};
		display: inline-block;
	`;

	onMount(() => {
		[firstPulse, secondPulse, thirdPulse].forEach((pulse, index) => {
			pulse.animate(
				[
					{ transform: "scale(1)", opacity: 1, offset: 0 },
					{ transform: "scale(0.1)", opacity: 0.7, offset: 0.45 },
					{ transform: "scale(1)", opacity: 1, offset: 0.8 },
				],
				{
					duration: speed,
					iterations: Infinity,
					delay: index * 200,
					fill: "both",
					easing: "cubic-bezier(.2,.68,.18,1.08)",
				}
			);
		});
	});
</script>

<div class="flx --flxColumn --flx-center">
	<div>
		<div bind:this={firstPulse} style={spinnerStyle} />
		<div bind:this={secondPulse} style={spinnerStyle} />
		<div bind:this={thirdPulse} style={spinnerStyle} />
	</div>
	<slot>
		{#if !hideLabel}
			<div class="txt --txtAlign-center">
				<p>{label}</p>
			</div>
		{/if}
	</slot>
</div>
