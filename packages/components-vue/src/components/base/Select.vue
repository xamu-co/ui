<template>
	<select
		v-bind="{
			...$attrs,
			...omit(props, ['modelValue', 'options']),
			id: selectId,
			name: name ?? selectId,
			title,
			required,
			disabled: (!!modelValue && selectOptions.length === 1) || disabled || undefined,
			tabindex: (disabled && '-1') || undefined,
		}"
		:value="modelValue"
		@input="handleInput"
	>
		<option v-once hidden disabled value="">
			{{ t("select_placeholder") }}
		</option>
		<option
			v-for="({ value, alias, disabled, hidden }, index) in selectOptions"
			:key="index"
			v-bind="{ value, disabled, hidden }"
		>
			{{ alias || value }}
		</option>
	</select>
</template>

<script setup lang="ts">
	import { computed, watch } from "vue";
	import deburr from "lodash-es/deburr";
	import omit from "lodash-es/omit";
	import { Md5 } from "ts-md5";

	import type { iFormOption } from "@open-xamu-co/ui-common-types";
	import { useI18n } from "@open-xamu-co/ui-common-helpers";
	import { toOption } from "@open-xamu-co/ui-common-helpers";

	import type { iSelectProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";

	interface iBaseSelectProps extends iSelectProps {
		/**
		 * Vue model value
		 * @private
		 */
		modelValue?: string | number;
	}

	/**
	 * Select Prototype
	 *
	 * @prototype
	 * @example
	 * <BaseSelect></BaseSelect>
	 */

	defineOptions({ name: "BaseSelect", inheritAttrs: false });

	const props = defineProps<iBaseSelectProps>();
	const emit = defineEmits(["update:model-value"]);

	const { t } = useHelpers(useI18n);

	const selectOptions = computed<iFormOption[]>(() => {
		return (props.options ?? []).map(toOption);
	});
	/** Prefer a predictable identifier */
	const selectId = computed(() => {
		const seed = deburr(props.name || props.placeholder || props.title);

		return props.id || Md5.hashStr(`select-${seed}`);
	});

	function handleInput(e: Event) {
		const { target } = e as Event & { target: HTMLSelectElement };

		return emit("update:model-value", target.value);
	}

	// lifecycle
	watch(
		selectOptions,
		(options) => {
			// set single option as value if required
			if (props.required && options.length === 1 && props.modelValue !== options[0].value) {
				emit("update:model-value", options[0].value);
			}
		},
		{ immediate: true }
	);
</script>
