<template>
	<component
		:is="type !== 'textarea' ? 'input' : 'textarea'"
		v-bind="{
			...$attrs,
			id: inputId,
			name: name ?? inputId,
			type: type ?? 'text',
			placeholder,
			title,
			autocomplete: autocomplete ?? 'on',
			required,
			disabled: disabled || undefined,
			tabindex: (disabled && '-1') || undefined,
			...(useChecked ? { checked: modelValue ?? !!$attrs.checked } : { value: modelValue }),
		}"
		@input="handleInput"
	/>
	<slot v-bind="{ id: inputId, name, modelValue }"></slot>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import deburr from "lodash-es/deburr";
	import { Md5 } from "ts-md5";

	import type { iInputProps } from "../../types/props";

	interface iBaseInputProps extends iInputProps {
		/**
		 * Vue model value
		 * @private
		 */
		modelValue?: unknown;
	}

	/**
	 * Input Prototype
	 *
	 * @prototype
	 * @example
	 * <BaseInput></BaseInput>
	 */

	defineOptions({ name: "BaseInput", inheritAttrs: false });

	const props = defineProps<iBaseInputProps>();
	const emit = defineEmits(["update:model-value"]);

	/** Prefer a predictable identifier */
	const inputId = computed(() => {
		const seed = deburr(props.placeholder || props.title);

		return props.name || props.id || Md5.hashStr(`input-${seed}`);
	});
	const useChecked = computed(() => {
		return props.type === "checkbox" || props.type === "radio";
	});

	function handleInput(e: Event) {
		const { target } = e as Event & { target: HTMLInputElement };

		return emit("update:model-value", useChecked.value ? target.checked : target.value);
	}
</script>
