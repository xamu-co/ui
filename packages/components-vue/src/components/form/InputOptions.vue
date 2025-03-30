<template>
	<slot v-if="!!options.length" v-bind="{ options }" :key="options.length"></slot>
	<p v-else class="--txtColor-danger">{{ t("form_required_options") }}</p>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	import type { tFormInput } from "@open-xamu-co/ui-common-types";
	import { toOption, useI18n } from "@open-xamu-co/ui-common-helpers";

	import { useHelpers } from "../../composables/utils";

	/**
	 * Require options
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputOptions", inheritAttrs: true });

	const props = defineProps<{ input: tFormInput }>();

	const { t } = useHelpers(useI18n);

	const options = ref(props.input.options?.map(toOption) || []);

	// lifecycle
	props.input.setRerender((updatedInput) => {
		options.value = updatedInput?.options?.map(toOption) || [];
	});
</script>
