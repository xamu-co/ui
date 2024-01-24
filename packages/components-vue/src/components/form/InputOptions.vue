<template>
	<slot v-if="!!options.length" v-bind="{ options }" :key="options.length"></slot>
	<p v-else class="--txtColor-danger">{{ t("form_required_options") }}</p>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	import { FormInput, toOption, useI18n } from "@open-xamu-co/ui-common-helpers";

	import useHelpers from "../../composables/helpers";

	/**
	 * Require options
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputOptions", inheritAttrs: true });

	const props = defineProps<{ input: FormInput }>();

	const { t } = useHelpers(useI18n);

	const options = ref(props.input.options?.map(toOption) || []);

	// lifecycle
	props.input.setRerender((updatedInput) => {
		options.value = updatedInput?.options?.map(toOption) || [];
	});
</script>
