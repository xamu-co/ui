<script lang="ts">
	import useUtils from "@open-xamu-co/ui-common-helpers/utils";

	import type { tPropsModifier } from "@open-xamu-co/ui-common-types";

	/**
	 * Modifier classes component
	 *
	 * @component
	 * @example
	 * <Modifier></Modifier>
	 */

	/** @props Wheter or not render the wrapper */
	export let hidden: tPropsModifier;
	/** @props Wheter or not render the wrapper */
	export let size: string | number;

	const { getModifierClasses: GMC } = useUtils();

	$: sizeClasses = size ? GMC([String(size)], { modifier: "size", divider: "-" }) : [];
	$: hiddenClasses = hidden ? GMC(hidden, { modifier: "hidden" }) : [];
	$: modifierClasses = [hiddenClasses, sizeClasses].flat(2);
</script>

<slot {modifierClasses} />
