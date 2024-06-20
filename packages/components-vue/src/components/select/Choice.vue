<template>
	<div v-if="!!choiceOptions?.length" class="flx --flxRow-wrap --flx-start-center --gap-5">
		<component
			:is="multiple || toggle ? ActionButtonToggle : ActionButton"
			v-for="option in choiceOptions"
			:key="`choice-${option.value}-${option.alias}-${options?.length}`"
			:theme="theme"
			:aria-label="option.alias || option.value"
			:active="modelValue.includes(option.value)"
			:title="modelValue.includes(option.value) ? t('select_selected') : ''"
			:disabled="disabled || (!multiple && modelValue.includes(option.value))"
			:round="round(option)"
			:tooltip="{ [option.alias || option.value]: !!(option.pattern || option.icon) }"
			tooltip-as-text
			tooltip-position="bottom"
			@click="choose(option.value)"
		>
			<template v-if="option.icon">
				<IconFa :name="option.icon" />
				<IconFa v-if="multiple" :name="option.icon" regular />
				<span v-if="option.alias">{{ option.alias }}</span>
			</template>
			<template v-else-if="option.pattern">
				<span v-if="option.alias">{{ option.alias }}</span>
				<figure
					class="avatar --size-xs --bdr"
					:class="`--bdrColor-${
						themeValues[!multiple && modelValue.includes(option.value) ? 0 : 1]
					}`"
					:style="
						isURL(option.pattern)
							? { backgroundImage: `url('${option.pattern}')` }
							: { backgroundColor: option.pattern }
					"
				></figure>
			</template>
			<span v-else>{{ option.alias || option.value }}</span>
		</component>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import isURL from "validator/lib/isURL";

	import { toOption, useI18n } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iSelectProps,
	} from "../../types/props";
	import { useHelpers } from "../../composables/utils";
	import useTheme from "../../composables/theme";
	import type { iFormOption } from "@open-xamu-co/ui-common-types";

	interface iSelectSimpleProps
		extends iSelectProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps {
		/**
		 * Vue model value
		 * @private
		 */
		modelValue: (string | number)[];
		/**
		 * Preffer button toggle
		 */
		toggle?: boolean;
	}

	/**
	 * Select element with filtering
	 *
	 * @component
	 */

	defineOptions({ name: "SelectChoice", inheritAttrs: false });

	const props = defineProps<iSelectSimpleProps>();
	const emit = defineEmits(["update:model-value"]);

	const { t } = useHelpers(useI18n);
	const { themeValues } = useTheme(props, true);

	const choiceOptions = computed<iFormOption[]>(() => {
		return props.options?.map(toOption) || [];
	});

	function choose(value: string | number) {
		if (props.multiple) {
			if (props.modelValue.includes(value)) {
				const index = props.modelValue.indexOf(value);

				if (index > -1) emit("update:model-value", props.modelValue.toSpliced(index, 1));
			} else emit("update:model-value", [...props.modelValue, value]);
		} else {
			// single value
			emit("update:model-value", [value]);
		}
	}

	function round(option: iFormOption): boolean {
		const value = String(option.alias || option.value);

		return value.length <= 2 || !!option.pattern;
	}
</script>
