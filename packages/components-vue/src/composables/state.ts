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
	return useHelpers((xo) => {
		const { getModifierClasses: GMC } = useUtils(xo);

		const noStateClasses = computed<string[]>(() => {
			const values: Record<string, boolean>[] = [{ noOverrides: !!props.noOverrides }];

			return props.noOverrides ? GMC(values, { prefix: "no" }) : [];
		});

		const stateClasses = computed<string[]>(() => {
			const values: Record<string, boolean>[] = [
				{
					...props.state,
					active: !!props.active,
					alert: !!props.alert,
					invalid: !!props.invalid,
				},
			];

			const hasState = !!(props.state || props.active || props.alert || props.invalid);
			const classes = hasState ? GMC(values, { prefix: "is" }) : [];

			return [...classes, ...noStateClasses.value];
		});

		return { stateClasses };
	});
}
