import { computed } from "vue";

import { useUtils } from "@open-xamu-co/ui-common-helpers";

import type { iUseStateProps } from "../types/props";
import { useHelpers } from "../composables/utils";

/**
 * State composable
 *
 * @composable
 */
export default function useState(props: iUseStateProps) {
	const { getModifierClasses: GMC } = useHelpers(useUtils);

	const stateClasses = computed<string[]>(() => {
		const values: Record<string, boolean>[] = [
			{ ...props.state, active: props.active || false, invalid: props.invalid || false },
		];

		return props.state || props.active || props.invalid ? GMC(values, { prefix: "is" }) : [];
	});

	return { stateClasses };
}
