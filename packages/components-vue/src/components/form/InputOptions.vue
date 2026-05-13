<template>
	<slot
		v-if="!!optionsArrayLength || typeof props.input.options === 'function'"
		v-bind="{ options }"
		:key="typeof options === 'function' ? `async-${input.name}` : optionsArrayLength"
	></slot>
	<p v-else class="--txtColor-danger">
		{{ input.meta?.swal?.missing_options || t("form_required_options") }}
	</p>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";

	import type { iFormInputOptions, iFormOption, tFormInput } from "@open-xamu-co/ui-common-types";
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

	const options = ref<iFormInputOptions>(
		typeof props.input.options === "function"
			? props.input.options
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

	// lifecycle
	props.input.setRerender((updatedInput) => {
		const opts = updatedInput?.options;

		if (typeof opts === "function") {
			options.value = opts;

			return [];
		}
		if (Array.isArray(opts)) {
			options.value = opts.reduce(reduceOptions, [] as iFormOption[]);
		}

		return [];
	});
</script>
