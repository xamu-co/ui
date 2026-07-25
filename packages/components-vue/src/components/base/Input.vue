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
			disabled: disabled || null,
			tabindex: (disabled && '-1') || tabindex || null,
			...(useChecked
				? { checked: modelValue ?? !!$attrs.checked }
				: props.type !== 'file'
					? { value: modelValue }
					: {}),
		}"
		@input="handleInput"
		@change="emit('change', $event)"
	/>
	<slot v-bind="{ id: inputId, name, modelValue }"></slot>
</template>

<script setup lang="ts">
	import { computed, useId } from "vue";
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
	const emit = defineEmits<{
		(e: "update:model-value", value: unknown): any;
		(e: "change", value: Event): any;
	}>();

	const fallbackId = useId();

	/** Prefer a predictable identifier */
	const inputId = computed(() => {
		if (props.id) return props.id;

		const seed = deburr(props.name || props.placeholder || props.title);

		return seed ? Md5.hashStr(`input-${seed}`) : fallbackId;
	});
	const useChecked = computed(() => {
		return props.type === "checkbox" || props.type === "radio";
	});

	function handleInput(e: Event) {
		const { target } = e as Event & { target: HTMLInputElement };

		return emit("update:model-value", useChecked.value ? target.checked : target.value);
	}
</script>
