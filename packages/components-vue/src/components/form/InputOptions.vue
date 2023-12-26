<template>
	<slot v-if="!!input.options?.length" v-bind="{ options: input.options.map(toOption) }"></slot>
	<p v-else class="--txtColor-danger">{{ t("form_required_options") }}</p>
</template>

<script setup lang="ts">
	import type { iFormInput } from "@open-xamu-co/ui-common-types";
	import { toOption, useI18n } from "@open-xamu-co/ui-common-helpers";

	import useHelpers from "../../composables/helpers";

	interface iFormInputOptions {
		input: iFormInput;
	}

	/**
	 * Require options
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputOptions", inheritAttrs: true });
	defineProps<iFormInputOptions>();

	const { t } = useHelpers(useI18n);
</script>
