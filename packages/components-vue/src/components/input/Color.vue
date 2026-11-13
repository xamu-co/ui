<template>
	<ModalSimple
		class="--display-inline-block"
		:position="['bottom', 'center']"
		:theme="theme"
		:target="target"
		:disabled="disabled"
		invert-theme
	>
		<template #toggle="{ toggleModal }">
			<BaseInput
				v-model="model"
				:class="[modifiersClasses, stateClasses, themeClasses]"
				class="iColor"
				v-bind="{ ...$attrs, ...omit(props, ['modelValue', 'size']), type: 'color' }"
				@click.prevent="() => toggleModal()"
			/>
		</template>
		<template #default="{ model: showPicker }">
			<TwitterPicker
				v-if="showPicker"
				ref="picker"
				v-model="model"
				v-bind="{ ...$attrs, ...omit(props, ['modelValue', 'size']) }"
				:preset-colors="[
					'#FF6900',
					'#FCB900',
					'#7BDCB5',
					'#00D084',
					'#8ED1FC',
					'#0693E3',
					// '#ABB8C3',
					'#EB144C',
					'#F78DA7',
					'#9900EF',
				]"
				class="iColor-picker --pBottom"
				tabindex="0"
			/>
		</template>
	</ModalSimple>
</template>

<script setup lang="ts">
	import { computed, type RendererElement } from "vue";
	import omit from "lodash-es/omit";
	import { TwitterPicker } from "vue-color";

	import BaseInput from "../base/Input.vue";
	import ModalSimple from "../modal/Simple.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iInputProps,
	} from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useState from "../../composables/state";
	import useTheme from "../../composables/theme";

	interface iInputColorProps
		extends iInputProps, iUseModifiersProps, iUseStateProps, iUseThemeProps {
		/**
		 * @private
		 */
		modelValue?: number | string;
		/**
		 * Target element to append the modal to
		 *
		 * Another modal could be the target so it appears nested
		 *
		 * @default body
		 */
		target?: string | RendererElement;
	}

	/**
	 * Color Input element
	 *
	 * @component
	 * @example
	 * <InputColor :value=""></InputColor>
	 */

	defineOptions({ name: "InputColor", inheritAttrs: false });

	const props = defineProps<iInputColorProps>();
	const emit = defineEmits<{ (e: "update:model-value", value?: string | number): any }>();

	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses } = useTheme(props);

	/**
	 * Input model
	 *
	 * @override to allow buttons we have to rewrite the v-model here
	 */
	const model = computed({
		get: () => props.modelValue,
		set: (value) => emit("update:model-value", value),
	});
</script>
