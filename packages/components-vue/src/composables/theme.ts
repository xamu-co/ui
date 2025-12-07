import { computed } from "vue";

import type { tProp, tThemeModifier, tThemeTuple } from "@open-xamu-co/ui-common-types";
import { useUtils } from "@open-xamu-co/ui-common-helpers";
import { eColors } from "@open-xamu-co/ui-common-enums";

import type { iUseThemeProps, iUseThemeTooltipProps } from "../types/props";
import { useHelpers } from "../composables/utils";

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
	return useHelpers((xo) => {
		const { getModifierClasses: GMC, getPropData } = useUtils(xo);

		const invertedThemeValues = computed(() => {
			const [first, second] = getThemeValues(props.theme ?? eColors.SECONDARY);

			const values: [tThemeModifier, tThemeModifier] = [first, second || eColors.LIGHT];

			if (!props.invertTheme) values.reverse();

			return values;
		});

		/** actual theme */
		const themeValues = computed<[tThemeModifier, tThemeModifier]>(() => {
			return [invertedThemeValues.value[1], invertedThemeValues.value[0]];
		});
		const dangerThemeValues = computed<[tThemeModifier, tThemeModifier]>(() => {
			return [
				eColors.DANGER,
				themeValues.value[1] === eColors.DARK ? eColors.DARK : eColors.LIGHT,
			];
		});
		const shadowClasses = computed<string[]>(() => {
			let withShadow;

			if (typeof props.shadow === "boolean") withShadow = props.shadow;
			else {
				if (!props.shadow?.length) return [];

				withShadow = props.shadow.some((theme) => themeValues.value[0] === theme);
			}

			if (!withShadow) return [];

			return GMC([{ shadow: withShadow }], { prefix: "" });
		});
		const themeClasses = computed<string[]>(() => {
			if (!props.theme) return [];

			const values = themeAsUnion ? themeValues.value : [themeValues.value[0]];

			return GMC([values.join("-")], { modifier: "tm", divider: "-" });
		});
		const dangerThemeClasses = computed<string[]>(() => {
			if (!props.theme) return [];

			const values = themeAsUnion ? dangerThemeValues.value : [dangerThemeValues.value[0]];

			return GMC([values.join("-")], { modifier: "tm", divider: "-" });
		});
		const tooltipAttributes = computed(() => {
			const tooltipText = props.tooltip && getPropData(props.tooltip);
			const hasColor = themeValues.value[1] !== eColors.LIGHT;

			if (!tooltipText) return { "aria-label": props.ariaLabel };

			return {
				"aria-label": props.ariaLabel ?? tooltipText,
				"data-tooltip": tooltipText,
				"data-tooltip-position": props.tooltipPosition,
				"data-tooltip-text": props.tooltipAsText ?? true,
				"data-tooltip-bg": themeValues.value[0],
				"data-tooltip-color": hasColor ? themeValues.value[1] : undefined,
			};
		});

		return {
			invertedThemeValues,
			themeValues,
			dangerThemeValues,
			themeClasses,
			dangerThemeClasses,
			shadowClasses,
			tooltipAttributes,
		};
	});
}
