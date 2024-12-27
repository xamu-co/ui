<template>
	<LoaderContent
		v-if="Array.isArray(model) && modelHasLength"
		class="flx --flxRow-wrap --flx-start-stretch --gap-5 --flx"
		v-bind="{ loading, content, errors, refresh }"
	>
		<slot></slot>
	</LoaderContent>
	<p v-else class="--txtColor-danger">
		{{ values.map((l) => t("form_requires_n_values", l)).join(" or ") }}
	</p>
</template>

<script setup lang="ts" generic="T">
	import { computed } from "vue";

	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import LoaderContent from "../loader/Content.vue";

	import { useHelpers } from "../../composables/utils";

	export interface iFormInputNValues<Ti> {
		model: Ti[];
		/** Expected model lengths */
		values: number[];
		content?: boolean;
		loading?: boolean;
		errors?: unknown;
		refresh?: (...args: any[]) => any;
	}

	/**
	 * Require options
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputNValues", inheritAttrs: true });

	const props = withDefaults(defineProps<iFormInputNValues<T>>(), { content: true });

	const { t } = useHelpers(useI18n);

	const modelHasLength = computed(() => {
		return props.values.some((l) => Array.isArray(props.model) && props.model.length === l);
	});
</script>
