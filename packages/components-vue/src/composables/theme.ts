import { watch, computed, ref } from "vue";

import type { tProp, tThemeModifier, tThemeTuple } from "@open-xamu-co/ui-common-types";
import { useUtils } from "@open-xamu-co/ui-common-helpers";
import { eColors } from "@open-xamu-co/ui-common-enums";

import type { iUseThemeProps, iUseThemeTooltipProps } from "../types/props";
import useHelpers from "../composables/helpers";

interface iAllUseThemeProps extends iUseThemeProps, iUseThemeTooltipProps {}

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

/**
 * Theme composable
 *
 * @composable
 */
export default function useTheme(props: iAllUseThemeProps, themeAsUnion?: boolean) {
	const { getModifierClasses: GMC, getPropData } = useHelpers(useUtils);

	const themeValues = ref<tThemeTuple>([eColors.SECONDARY]);
	const themeClasses = ref<string[]>([]);
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

	watch(
		() => props.theme,
		(newTheme) => {
			let values = getThemeValues(newTheme ?? eColors.SECONDARY);

			values[1] = values[1] || eColors.LIGHT;

			if (!themeAsUnion) values = [values[0]];

			themeValues.value = values;

			if (!newTheme) themeClasses.value = [];
			else themeClasses.value = GMC([values.join("-")], { modifier: "tm", divider: "-" });
		},
		{ immediate: true }
	);

	return { themeValues, themeClasses, tooltipAttributes };
}
