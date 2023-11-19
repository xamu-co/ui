<script context="module" lang="ts">
	export interface $$props extends HTMLImgAttributes {}
</script>

<script lang="ts">
	import type { HTMLImgAttributes } from "svelte/elements";

	/**
	 * Img Component
	 *
	 * @component
	 * @example
	 * <BaseImg></BaseImg>
	 */

	/** @props image url or path */
	export let src = "";
	/** @props image description */
	export let alt = "";
	/** @props image loading mode */
	export let loading: "eager" | "lazy" = "lazy";
</script>

<img {src} {alt} {loading} {...$$restProps} />
