<template>
	<BaseInput
		type="color"
		:disabled="disabled"
		:class="getClassesString([modifiersClasses, stateClasses, themeClasses, 'iColor'])"
		v-bind="$attrs"
	/>
</template>

<script setup lang="ts">
	import { useUtils } from "@open-xamu-co/ui-common-helpers";

	import BaseInput from "../base/Input.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iInputProps,
	} from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";
	import useHelpers from "../../composables/helpers";

	interface iInputTextProps
		extends iInputProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps {}

	/**
	 * Color Input element
	 *
	 * @component
	 * @example
	 * <InputColor :value=""></InputColor>
	 */

	defineOptions({ name: "InputColor", inheritAttrs: false });

	const props = defineProps<iInputTextProps>();

	const { getClassesString } = useHelpers(useUtils);
	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses } = useTheme(props);
</script>
