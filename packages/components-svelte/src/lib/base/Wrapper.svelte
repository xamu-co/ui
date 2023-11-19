<script lang="ts">
	import type { ComponentType } from "svelte";

	/**
	 * Wrapper Component
	 *
	 * @component
	 * @example
	 * <BaseWrapper></BaseWrapper>
	 */

	/** @props Wheter or not render the wrapper */
	export let wrap: boolean;
	/** @props Component or tag to render */
	export let el: ComponentType<unknown> | string = "div";
</script>

{#if wrap}
	{#if typeof el == "string"}
		<svelte:element this={el}>
			<slot />
		</svelte:element>
	{:else}
		<svelte:component this={el}>
			<slot />
		</svelte:component>
	{/if}
{:else}
	<slot />
{/if}
