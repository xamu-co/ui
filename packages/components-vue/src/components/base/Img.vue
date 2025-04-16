<template>
	<component
		:is="imageComponent"
		v-bind="{ ...$attrs, ...props }"
		:placeholder="placeholder || imagePlaceholder"
	/>
</template>

<script setup lang="ts">
	import { type PropType, inject } from "vue";

	import type { iVuePluginOptions } from "../../types/plugin";

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
		/**
		 * Url to an image to be used as placeholder for images that failed to load
		 * Overrides the plugin's imagePlaceholder
		 */
		placeholder: {
			type: String,
			default: null,
		},
	});

	const { imageComponent = "img", imagePlaceholder } = inject<iVuePluginOptions>("xamu") || {};
</script>
