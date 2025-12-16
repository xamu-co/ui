<template>
	<component
		:is="imageComponent"
		v-bind="{ ...$attrs, ...props }"
		:placeholder="placeholder || imagePlaceholder"
		@load="emit('load', $event)"
		@error="emit('error', $event)"
	/>
</template>

<script setup lang="ts">
	import { inject } from "vue";

	import type { iVuePluginOptions } from "../../types/plugin";

	/**
	 * Img Prototype
	 *
	 * @prototype
	 * @example
	 * <BaseImg></BaseImg>
	 */

	defineOptions({ name: "BaseImg", inheritAttrs: false });

	const emit = defineEmits(["error", "load"]);

	const props = withDefaults(
		defineProps<{
			/**
			 * image url or path
			 */
			src?: string;
			alt?: string;
			format?: string;
			loading?: "eager" | "lazy";
			/**
			 * Url to an image to be used as placeholder for images that failed to load
			 * Overrides the plugin's imagePlaceholder
			 */
			placeholder?: string;
		}>(),
		{ loading: "lazy" }
	);

	const { imageComponent = "img", imagePlaceholder } = inject<iVuePluginOptions>("xamu") || {};
</script>
