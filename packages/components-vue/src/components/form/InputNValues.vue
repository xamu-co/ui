<template>
	<div
		v-if="Array.isArray(model) && modelHasLength"
		class="flx --flxColumn --flxRow-wrap:md --flx-start-stretch --gap-5 --flx"
	>
		<slot></slot>
	</div>
	<p v-else class="--txtColor-danger">
		{{ values.map((l) => t("form_requires_n_values", l)).join(" or ") }}
	</p>
</template>

<script setup lang="ts" generic="T">
	import { computed } from "vue";

	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import { useHelpers } from "../../composables/utils";

	export interface iFormInputNValues<Ti> {
		model: Ti[];
		values: number[];
	}

	/**
	 * Require options
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputNValues", inheritAttrs: true });

	const props = defineProps<iFormInputNValues<T>>();

	const { t } = useHelpers(useI18n);

	const modelHasLength = computed(() => {
		return props.values.some((l) => Array.isArray(props.model) && props.model.length === l);
	});
</script>
