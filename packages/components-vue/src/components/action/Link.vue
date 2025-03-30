<template>
	<BaseAction
		v-bind="{ ...$attrs, ...props, ...tooltipAttributes }"
		:class="[modifiersClasses, stateClasses, themeClasses, shadowClasses]"
		class="link"
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

	interface iActionLinkProps
		extends iActionProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps,
			iUseThemeTooltipProps {}

	/**
	 * Action Link Component
	 *
	 * @component
	 * @example
	 * <ActionLink></ActionLink>
	 */

	defineOptions({ name: "ActionLink", inheritAttrs: false });

	const props = defineProps<iActionLinkProps>();

	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses, shadowClasses, tooltipAttributes } = useTheme(props);
</script>
