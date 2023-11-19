<template>
	<div :class="$attrs.class" class="flx --flxRow --flx-center --gap-5">
		<BaseWrapper :wrap="!!icon && !textarea" :disabled="disabled" :class="inputClasses">
			<BaseInput
				v-model="model"
				v-bind="{
					..._.omit($attrs, 'class'),
					type: textarea ? 'textarea' : inputType,
					placeholder,
					disabled,
					...((isNumber || isPhone) && {
						pattern: '[0-9]*',
						oninput: 'this.value = this.value.replace(/[^0-9]/g,\'\')',
					}),
					...(!isNumber && { min: undefined, max: undefined }),
					...(!(!!icon && !textarea) && { class: inputClasses }),
				}"
			/>
			<IconFa v-if="!!icon && !textarea" v-bind="iconProps" :name="icon ?? 'user-group'" />
		</BaseWrapper>
		<template v-if="type === 'number' && (Number.isInteger(min) || Number.isInteger(max))">
			<ActionButtonToggle
				:disabled="Number(model) <= minValue"
				:size="size"
				:theme="theme"
				:aria-label="t('decrease')"
				:tooltip="t('decrease')"
				tooltip-position="left"
				tooltip-as-text
				round
				@click="decrease"
			>
				<IconFa name="minus" />
				<IconFa name="minus" regular />
			</ActionButtonToggle>
			<ActionButtonToggle
				:disabled="Number(model) >= maxValue"
				:size="size"
				:theme="theme"
				:tooltip="t('increase')"
				tooltip-position="left"
				round
				@click="increase"
			>
				<IconFa name="plus" />
				<IconFa name="plus" regular />
			</ActionButtonToggle>
		</template>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import _ from "lodash";
	import type { IconName } from "@fortawesome/fontawesome-common-types";

	import type { iFormIconProps, tTextInputType } from "@open-xamu-co/ui-common-types";
	import { useI18n, useUtils } from "@open-xamu-co/ui-common-helpers";

	import BaseWrapper from "../base/Wrapper.vue";
	import BaseInput from "../base/Input.vue";
	import IconFa from "../icon/Fa.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";

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
			iUseThemeProps {
		type?: tTextInputType;
		placeholder?: string;
		/**
		 * FontAwesome icon
		 */
		icon?: IconName;
		iconProps?: iFormIconProps;
		/**
		 * use textarea
		 */
		textarea?: boolean;
		min?: number | string;
		max?: number | string;
		/**
		 * @private
		 */
		modelValue?: number | string;
	}

	/**
	 * Text Input element
	 * TODO: Support wysiwyg or markdown editor conditionally
	 *
	 * @component
	 * @example
	 * <InputText :value=""></InputText>
	 */

	defineOptions({ name: "InputText", inheritAttrs: false });

	const props = defineProps<iInputTextProps>();
	const emit = defineEmits(["update:model-value"]);

	const { t } = useHelpers(useI18n);
	const { getClassesString } = useHelpers(useUtils);
	const { modifiersClasses } = useModifiers(props);
	const { stateClasses } = useState(props);
	const { themeClasses } = useTheme(props);

	const inputType = computed(() => props.type ?? "text");
	const minValue = computed(() => Number(props.min) || 0);
	const maxValue = computed(() => Number(props.max) || 9e9);
	const isNumber = computed<boolean>(() => ["number", "tel"].includes(inputType.value));
	const isPhone = computed<boolean>(() => inputType.value === "tel");

	/**
	 * Input model
	 *
	 * @override to allow buttons we have to rewrite the v-model here
	 */
	const model = computed({
		get: () => {
			const value = props.modelValue;

			return inputType.value !== "number" ? value : Number(value);
		},
		set: (value) => emit("update:model-value", value),
	});
	const inputClasses = computed(() => {
		return [
			"iTxt",
			getClassesString([modifiersClasses.value, stateClasses.value, themeClasses.value]),
		];
	});

	/**
	 * increase number
	 */
	function increase() {
		if (typeof model.value === "number" && model.value < maxValue.value) model.value++;
	}

	/**
	 * decrease number
	 */
	function decrease() {
		if (typeof model.value === "number" && model.value > minValue.value) model.value--;
	}
</script>
