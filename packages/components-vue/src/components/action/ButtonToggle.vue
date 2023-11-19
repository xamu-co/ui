<template>
	<BaseAction
		v-bind="{ ...$attrs, ...props, ...tooltipAttributes }"
		:class="getClassesString([modifiersClasses, stateClasses, themeClasses, shadowClasses])"
		class="bttnToggle"
	>
		<slot></slot>
	</BaseAction>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	import { useUtils } from "@open-xamu-co/ui-common-helpers";

	import BaseAction from "../base/Action.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iActionProps,
		iUseThemeTooltipProps,
	} from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";
	import useHelpers from "../../composables/helpers";

	interface iActionButtonToggleProps
		extends iActionProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps,
			iUseThemeTooltipProps {
		shadow?: boolean;
	}

	/**
	 * Action Button Toggle Component
	 * Visually toggles
	 *
	 * @component
	 * @example
	 * <ButtonToggle></ButtonToggle>
	 */

	defineOptions({ name: "ActionButtonToggle", inheritAttrs: false });

	const props = defineProps<iActionButtonToggleProps>();

	const { getModifierClasses: GMC, getClassesString } = useHelpers(useUtils);
	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses, tooltipAttributes } = useTheme(props);

	const shadowClasses = computed<string[]>(() => {
		return props.shadow ? GMC(props.shadow, { modifier: "shadow" }) : [];
	});
</script>
