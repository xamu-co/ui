<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	import type { tPropsModifier } from "@open-xamu-co/ui-common-types";
	import useUtils from "@open-xamu-co/ui-common-helpers/utils";

	import Modifier from "../modifiers/Simple.svelte";

	/**
	 * Icon
	 *
	 * @component
	 * @example
	 * <Icon size="50" />
	 */

	interface $$props extends HTMLAttributes<HTMLSpanElement> {}

	// GLOBAL PROPS
	/** @props Wheter or not render the wrapper */
	export let hidden: tPropsModifier;
	/** @props Wheter or not render the wrapper */
	export let size: string | number;

	const { getClassesString } = useUtils();
</script>

<Modifier {size} {hidden} let:modifierClasses>
	<i
		aria-hidden="true"
		class={getClassesString([
			modifierClasses,
			!!$$slots.default ? "svg" : "icon",
			$$props.class,
		])}
		{...$$restProps}
	>
		<slot />
	</i>
</Modifier>
