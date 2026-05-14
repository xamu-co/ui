<template>
	<slot
		v-if="!!optionsArrayLength || input.optionsFilter"
		v-bind="{ options: input.optionsFilter ? optionsWithReducer : baseOptions }"
		:key="input.optionsFilter ? `async-${input.name}` : optionsArrayLength"
	></slot>
	<p v-else class="--txtColor-danger">
		{{ input.meta?.swal?.missing_options || t("form_required_options") }}
	</p>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";

	import type { iFormOption, tFormInput, tOptionsLoaderFn } from "@open-xamu-co/ui-common-types";
	import { getFormInputOptionsLength, toOption, useI18n } from "@open-xamu-co/ui-common-helpers";

	import { useHelpers } from "../../composables/utils";

	/**
	 * Require options
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputOptions", inheritAttrs: true });

	const props = defineProps<{
		input: tFormInput;
		/**
		 * Currently selected value
		 */
		selectedValue?: number | string;
		/**
		 * Currently selected values
		 * When `input.multiple === true`
		 * @example [selectedValue, ...otherValues]
		 */
		selectedValues?: (number | string)[];
	}>();

	const { t } = useHelpers(useI18n);

	const baseOptions = ref<iFormOption[]>(
		props.input.optionsFilter
			? []
			: (props.input.options ?? []).reduce(reduceOptions, [] as iFormOption[])
	);

	const optionsArrayLength = computed(() => getFormInputOptionsLength(props.input.options));

	function reduceOptions(acc: iFormOption[], optionLike: string | number | iFormOption) {
		const option = toOption(optionLike);

		// Filter out previously selected options, to avoid duplicates
		if (option.value === props.selectedValue || !props.selectedValues?.includes(option.value)) {
			acc.push(option);
		}

		return acc;
	}

	/** Make sure there are no duplicates */
	const optionsWithReducer: tOptionsLoaderFn = async (v) => {
		const filteredOptions = await props.input.optionsFilter?.(v);

		return (filteredOptions || baseOptions.value).reduce(reduceOptions, [] as iFormOption[]);
	};

	// lifecycle
	props.input.setRerender((updatedInput) => {
		const opts = updatedInput?.options;

		if (Array.isArray(opts)) {
			baseOptions.value = opts.reduce(reduceOptions, [] as iFormOption[]);
		}

		return [];
	});
</script>
