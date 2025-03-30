<template>
	<BaseInput
		:class="[modifiersClasses, stateClasses, themeClasses]"
		class="iColor"
		v-bind="{ ...$attrs, ...omit(props, ['modelValue', 'size']), type: 'color' }"
	/>
</template>

<script setup lang="ts">
	import omit from "lodash-es/omit";

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

	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses } = useTheme(props);
</script>
