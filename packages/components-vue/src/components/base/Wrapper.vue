<template>
	<component :is="el" v-if="wrap" v-slot="elSlots" v-bind="{ ...$attrs, ...$slots }">
		<slot v-bind="{ ...elSlots }"></slot>
	</component>
	<slot v-else></slot>
</template>

<script setup lang="ts">
	import type {
		Component as VueComponent,
		FunctionalComponent,
		DefineComponent,
		PropType,
	} from "vue";

	/**
	 * Wrapper Component
	 *
	 * Conditionally wraps content
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
	/**
	 * TODO: improve type safety for scoped slots in wrapper
	 */
	defineSlots<{ default(v: Record<string, any>): Record<string, any> }>();
</script>
