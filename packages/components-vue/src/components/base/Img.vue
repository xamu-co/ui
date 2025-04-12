<template>
	<component :is="imageComponent" v-bind="{ ...$attrs, ...props }" />
</template>

<script setup lang="ts">
	import { type PropType, inject } from "vue";

	import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

	import type { vComponent } from "../../types/plugin";

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

	const { imageComponent = "img" } = inject<iPluginOptions<vComponent>>("xamu") || {};
</script>
