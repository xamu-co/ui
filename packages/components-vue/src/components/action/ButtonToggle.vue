<template>
	<BaseAction
		v-bind="{ ...$attrs, ...props, ...tooltipAttributes }"
		:class="[modifiersClasses, stateClasses, themeClasses, shadowClasses]"
		class="bttnToggle"
	>
		<slot></slot>
	</BaseAction>
</template>

<script setup lang="ts">
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

	interface iActionButtonToggleProps
		extends iActionProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps,
			iUseThemeTooltipProps {}

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

	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses, shadowClasses, tooltipAttributes } = useTheme(props);
</script>
