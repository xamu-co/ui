import { computed } from "vue";

import type { tProp, tThemeModifier, tThemeTuple } from "@open-xamu-co/ui-common-types";
import { useUtils } from "@open-xamu-co/ui-common-helpers";
import { eColors } from "@open-xamu-co/ui-common-enums";

import type { iUseThemeProps, iUseThemeTooltipProps } from "../types/props";
import useHelpers from "../composables/helpers";

interface iAllUseThemeProps extends iUseThemeProps, iUseThemeTooltipProps {
	/**
	 * Theme as union
	 * @private
	 */
	themeAsUnion?: boolean;
}

/**
 * Theme composable
 *
 * @composable
 */
export default function useTheme(props: iAllUseThemeProps) {
	const { getModifierClasses: GMC, getPropData } = useHelpers(useUtils);

	const themeValues = computed(() => {
		return getThemeValues(props.theme || eColors.SECONDARY);
	});
	/** TODO: make theme classes reactive */
	const themeClasses = computed<string[]>(() => {
		if (!props.theme) return [];

		let values = themeValues.value;

		values[1] = values[1] || eColors.LIGHT;

		if (!props.themeAsUnion) values = [values[0]];

		return GMC([values.join("-")], { modifier: "tm", divider: "-" });
	});
	const tooltipAttributes = computed(() => {
		const tooltipText = props.tooltip && getPropData(props.tooltip);
		const hasColor = themeValues.value[1] !== eColors.LIGHT;

		return tooltipText
			? {
					"arial-label": tooltipText,
					"data-tooltip": tooltipText,
					"data-tooltip-position": props.tooltipPosition,
					"data-tooltip-text": props.tooltipAsText ?? true,
					"data-tooltip-bg": themeValues.value[0],
					"data-tooltip-color": hasColor ? themeValues.value[1] : undefined,
				}
			: null;
	});

	/** Return theme tuple */
	function getThemeValues(values: tThemeTuple | tProp<tThemeModifier>): tThemeTuple {
		if (Array.isArray(values)) {
			return [values[0], values[1] || eColors.LIGHT];
		} else if (typeof values === "object" && values !== null) {
			const themeArr = Object.entries(values).filter(([_key, value]) => value);

			// There could be multiple valid theme combinations, but we are only returning the first one
			return getThemeValues([themeArr[0][0] as tThemeModifier]);
		}

		return getThemeValues([values]);
	}

	return { themeValues, themeClasses, tooltipAttributes };
}
