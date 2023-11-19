<template>
	<component :is="el" v-if="wrap" v-bind="$attrs">
		<slot></slot>
	</component>
	<slot v-else></slot>
</template>

<script setup lang="ts">
	import { Component as VueComponent, FunctionalComponent, DefineComponent, PropType } from "vue";

	/**
	 * Wrapper Component
	 *
	 * @component
	 * @example
	 * <Wrapper></Wrapper>
	 */

	defineOptions({ name: "BaseWrapper", inheritAttrs: false });
	defineProps({
		/**
		 * Wheter or not render the wrapper
		 */
		wrap: {
			type: Boolean,
			required: true,
		},
		/**
		 * Component or tag to render
		 */
		el: {
			type: [String, Object, Function] as PropType<
				VueComponent | FunctionalComponent | DefineComponent | string
			>,
			default: "div",
		},
	});
</script>
