<template>
	<BaseSelect
		:class="[modifiersClasses, stateClasses, themeClasses]"
		class="iSelect"
		v-bind="{ ...$attrs, ...props }"
	/>
</template>

<script setup lang="ts">
	import BaseSelect from "../base/Select.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iSelectProps,
	} from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";

	interface iSelectSimpleProps
		extends iSelectProps, iUseModifiersProps, iUseStateProps, iUseThemeProps {}

	/**
	 * Select element with filtering
	 *
	 * @component
	 */

	defineOptions({ name: "SelectSimple", inheritAttrs: false });

	const props = defineProps<iSelectSimpleProps>();

	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses } = useTheme(props, true);
</script>
