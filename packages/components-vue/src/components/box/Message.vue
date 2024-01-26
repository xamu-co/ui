<!-- eslint-disable vue/no-v-html -->
<template>
	<div :class="modifiersClasses" class="flx --flxColumn --flx-center --width" v-bind="$attrs">
		<div class="txt --txtAlign-center --width">
			<div
				:class="[
					modifiersClasses,
					stateClasses,
					themeClasses,
					GMC([themeValues[0]], { modifier: 'txtColor', divider: '-' }),
					GMC(asButton ?? false, { modifier: 'button' }),
				]"
				class="box"
			>
				<p v-if="text" v-html="text"></p>
				<slot v-else></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useUtils } from "@open-xamu-co/ui-common-helpers";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iActionProps,
	} from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";
	import useHelpers from "../../composables/helpers";

	interface iBoxMessageProps
		extends iActionProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps {
		/**
		 * Text or html
		 */
		text?: string;
		/**
		 * less padding
		 */
		asButton?: boolean;
	}

	/**
	 * BoxMessage
	 * Displays a box with a message
	 * Useful for warnings or just general info
	 *
	 * @component
	 * @example
	 * <BoxMessage name="50"></BoxMessage>
	 */

	defineOptions({ name: "BoxMessage", inheritAttrs: false });

	const props = defineProps<iBoxMessageProps>();

	const { getModifierClasses: GMC } = useHelpers(useUtils);
	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses, themeValues } = useTheme(props);
</script>
