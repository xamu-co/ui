<template>
	<select
		v-bind="{
			...$attrs,
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
		<option v-for="({ value, alias }, index) in selectOptions" :key="index" :value="value">
			{{ alias || value }}
		</option>
	</select>
</template>

<script setup lang="ts">
	import { computed, watch } from "vue";

	import type { iFormOption } from "@open-xamu-co/ui-common-types";
	import { useI18n } from "@open-xamu-co/ui-common-helpers";
	import { toOption } from "@open-xamu-co/ui-common-helpers";

	import type { iSelectProps } from "../../types/props";
	import useUUID from "../../composables/uuid";
	import useHelpers from "../../composables/helpers";

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
	const { uuid } = useUUID();

	const randomId = uuid().replace("-", "").substring(0, 8);
	const selectOptions = computed<iFormOption[]>(() => {
		return (props.options ?? []).map(toOption);
	});
	const selectId = computed(() => {
		return props.id ?? `select${randomId}`;
	});

	function handleInput(e: Event) {
		const { target } = e as Event & { target: HTMLSelectElement };

		return emit("update:model-value", target.value);
	}

	// lifecycle

	// set single option as value
	if (selectOptions.value.length === 1) emit("update:model-value", selectOptions.value[0].value);

	watch(
		selectOptions,
		(options) => {
			// reset model
			if (!options.length) emit("update:model-value", "");
			// set single option as value
			if (options.length === 1) emit("update:model-value", options[0].value);
		},
		{ immediate: false }
	);
</script>
