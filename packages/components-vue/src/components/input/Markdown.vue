<template>
	<!-- <BaseInput
		:class="[modifiersClasses, stateClasses, themeClasses]"
		class="iColor"
		v-bind="{ ...$attrs, ...omit(props, ['modelValue', 'size']), type: 'color' }"
	/> -->
	<div>
		<MEditor v-model="text" @on-change="handleChange" />
		<div v-safe-html="markdownContent" class="m-editor-preview"></div>
	</div>
</template>

<script setup lang="ts">
	// import omit from "lodash-es/omit";
	import { MEditor } from "@simple-m-editor/vue/dist/simple-m-editor.mjs";
	import "@simple-m-editor/vue/dist/style.css";

	// import BaseInput from "../base/Input.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iInputProps,
	} from "../../types/props";
	// import useModifiers from "../../composables/modifiers";
	// import useState from "../../composables/state";
	// import useTheme from "../../composables/theme";
	import { ref } from "vue";

	interface iInputTextProps
		extends iInputProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps {}

	/**
	 * Markdown Input element
	 *
	 * @component
	 * @example
	 * <InputMarkdown :value=""></InputMarkdown>
	 */

	defineOptions({ name: "InputMarkdown", inheritAttrs: false });
	defineProps<iInputTextProps>();

	// const { modifiersClasses } = useModifiers(props);
	// const { stateClasses } = useState(props);
	// const { themeClasses } = useTheme(props);

	const text = ref("");
	const markdownContent = ref("");
	const handleChange = (data: { htmlContent: string }) => {
		markdownContent.value = data.htmlContent;
	};
</script>
