import { computed } from "vue";

import { useUtils } from "@open-xamu-co/ui-common-helpers";

import type { iUseModifiersProps } from "../types/props";
import { useHelpers } from "../composables/utils";

/**
 * Base modifier classes composable
 *
 * @composable
 */
export default function useModifiers(props: iUseModifiersProps) {
	const { getModifierClasses: GMC } = useHelpers(useUtils);

	const modifiersClasses = computed<string[]>(() => {
		const hidden = props.hidden || (typeof props.hidden === "string" && !props.hidden.length);

		return [
			props.size ? GMC([String(props.size)], { modifier: "size", divider: "-" }) : [],
			hidden ? GMC(hidden, { modifier: "hidden" }) : [],
		].flat(2);
	});

	return { modifiersClasses };
}
