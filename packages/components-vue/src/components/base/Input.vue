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
	import _ from "lodash";

	import type { iInputProps } from "../../types/props";
	import useUUID from "../../composables/uuid";

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

	const { uuid } = useUUID();

	const randomId = uuid().replace("-", "").substring(0, 8);
	/** Prefer a predictable identifier */
	const inputId = computed(() => {
		const seed = _.deburr(props.id || props.name || props.placeholder || props.title);

		return `input_${seed.replaceAll(" ", "") || randomId}`;
	});
	const useChecked = computed(() => {
		return props.type === "checkbox" || props.type === "radio";
	});

	function handleInput(e: Event) {
		const { target } = e as Event & { target: HTMLInputElement };

		return emit("update:model-value", useChecked.value ? target.checked : target.value);
	}
</script>
