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
		<option v-for="({ value, alias }, index) in selectOptions" :key="index" :value="value">
			{{ alias || value }}
		</option>
	</select>
</template>

<script setup lang="ts">
	import { computed, watch } from "vue";
	import deburr from "lodash-es/deburr";
	import omit from "lodash-es/omit";

	import type { iFormOption } from "@open-xamu-co/ui-common-types";
	import { useI18n } from "@open-xamu-co/ui-common-helpers";
	import { toOption } from "@open-xamu-co/ui-common-helpers";

	import type { iSelectProps } from "../../types/props";
	import useUUID from "../../composables/crypto";
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
	const { uuid } = useUUID();

	const randomId = uuid().replace("-", "").substring(0, 8);
	const selectOptions = computed<iFormOption[]>(() => {
		return (props.options ?? []).map(toOption);
	});
	/** Prefer a predictable identifier */
	const selectId = computed(() => {
		const seed = deburr(props.id || props.name || props.placeholder || props.title);

		return `select_${seed.replaceAll(" ", "") || randomId}`;
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
