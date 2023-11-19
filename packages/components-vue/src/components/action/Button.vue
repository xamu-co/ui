<template>
	<BaseAction
		v-bind="{ ...$attrs, ...props, ...tooltipAttributes }"
		:class="getClassesString([modifiersClasses, stateClasses, themeClasses])"
		class="bttn"
	>
		<slot></slot>
	</BaseAction>
</template>

<script setup lang="ts">
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

	interface iActionButtonProps
		extends iActionProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps,
			iUseThemeTooltipProps {}

	/**
	 * Action Button Component
	 *
	 * @component
	 * @example
	 * <ActionButton></ActionButton>
	 */

	defineOptions({ name: "ActionButton", inheritAttrs: false });

	const props = defineProps<iActionButtonProps>();

	const { getClassesString } = useHelpers(useUtils);
	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses, tooltipAttributes } = useTheme({
		...props,
		themeAsUnion: true,
	});
</script>
