<template>
	<slot v-if="!!options.length" v-bind="{ options }" :key="options.length"></slot>
	<p v-else class="--txtColor-danger">
		{{ input.meta?.swal.missing_options || t("form_required_options") }}
	</p>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	import type { iFormOption, tFormInput } from "@open-xamu-co/ui-common-types";
	import { toOption, useI18n } from "@open-xamu-co/ui-common-helpers";

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
		 */
		selectedValues?: (number | string)[];
	}>();

	const { t } = useHelpers(useI18n);

	const options = ref((props.input.options || []).reduce(reduceOptions, []));

	function reduceOptions(acc: iFormOption[], optionLike: string | number | iFormOption) {
		const option = toOption(optionLike);

		if (option.value === props.selectedValue || !props.selectedValues?.includes(option.value)) {
			acc.push(option);
		}

		return acc;
	}

	// lifecycle
	props.input.setRerender((updatedInput) => {
		options.value = (updatedInput?.options || []).reduce(reduceOptions, []);
	});
</script>
