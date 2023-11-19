<template>
	<component :is="imageComponent" v-bind="{ ...$attrs, ...props }" />
</template>

<script setup lang="ts">
	import { PropType, computed, inject, Component as VueComponent } from "vue";

	import { iPluginOptions } from "@open-xamu-co/ui-common-types";

	/**
	 * Img Prototype
	 *
	 * @prototype
	 * @example
	 * <BaseImg></BaseImg>
	 */

	defineOptions({ name: "BaseImg", inheritAttrs: false });

	const props = defineProps({
		/**
		 * image url or path
		 */
		src: {
			type: String,
			default: null,
		},
		alt: {
			type: String,
			default: null,
		},
		format: {
			type: String,
			default: null,
		},
		loading: {
			type: String as PropType<"eager" | "lazy">,
			default: "lazy",
		},
	});

	const xamuOptions = inject<iPluginOptions<VueComponent>>("xamu");

	const imageComponent = computed(() => xamuOptions?.imageComponent || "img");
</script>
