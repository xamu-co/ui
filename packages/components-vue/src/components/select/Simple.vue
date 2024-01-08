<template>
	<BaseSelect
		:class="getClassesString([modifiersClasses, stateClasses, themeClasses])"
		class="iSelect"
		v-bind="{ ...$attrs, ..._.omit(props, 'modelValue'), options, required, disabled }"
	/>
</template>

<script setup lang="ts">
	import _ from "lodash";

	import { useUtils } from "@open-xamu-co/ui-common-helpers";

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
	import useHelpers from "../../composables/helpers";

	interface iSelectSimpleProps
		extends iSelectProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps {}

	/**
	 * Select element with filtering
	 *
	 * @component
	 */

	defineOptions({ name: "SelectSimple", inheritAttrs: false });

	const props = defineProps<iSelectSimpleProps>();

	const { getClassesString } = useHelpers(useUtils);
	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses } = useTheme({ ...props, themeAsUnion: true });
</script>
