<template>
	<BaseAction
		v-bind="{ ...$attrs, ...props, ...tooltipAttributes }"
		:class="[modifiersClasses, stateClasses, themeClasses, buttonTypeClass]"
	>
		<slot></slot>
	</BaseAction>
</template>

<script setup lang="ts">
	import { computed } from "vue";

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

	interface iActionButtonProps
		extends
			iActionProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps,
			iUseThemeTooltipProps {
		/**
		 * Use vertical button
		 */
		y?: boolean;
		/**
		 * Alias for y
		 */
		vertical?: boolean;
	}

	/**
	 * Action Button Component
	 *
	 * @component
	 * @example
	 * <ActionButton></ActionButton>
	 */

	defineOptions({ name: "ActionButton", inheritAttrs: false });

	const props = defineProps<iActionButtonProps>();

	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses, tooltipAttributes } = useTheme(props, true);

	const buttonTypeClass = computed(() => {
		return props.y || props.vertical ? "bttnY" : "bttn";
	});
</script>
