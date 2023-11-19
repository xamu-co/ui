<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";
	import type { HTMLImgAttributes } from "svelte/elements";

	import type { tPropsModifier } from "@open-xamu-co/ui-common-types";
	import useUtils from "@open-xamu-co/ui-common-helpers/utils";

	import Icon from "./Simple.svelte";

	interface $$props extends HTMLImgAttributes {}

	/**
	 * FontAwesome Icon
	 *
	 * @component
	 * @example
	 * <IconFa size="50" />
	 */

	// GLOBAL PROPS
	/** @props Wheter or not render the wrapper */
	export let hidden: tPropsModifier;
	/** @props Wheter or not render the wrapper */
	export let size: string | number;

	//INTERNALS
	/** @props FA icon name */
	export let name: IconName = "cubes";
	/** @props FA icon of regular type */
	export let regular = false;
	/** @props FA icon of brand type */
	export let brand = false;

	const { getClassesString } = useUtils();

	/**
	 * Free version of FA only delivers brand, solid and regular
	 * Assumes solid as default
	 */
	$: typeClass = (brand && "fab") || (regular && "far") || "fas";
</script>

<Icon
	{size}
	{hidden}
	class={getClassesString([`fa-${name}`, typeClass, $$props.class])}
	{...$$restProps}
/>
