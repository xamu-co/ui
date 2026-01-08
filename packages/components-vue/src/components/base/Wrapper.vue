<template>
	<component :is="wrapper" v-if="wrap" v-slot="elSlots" v-bind="{ ...$attrs, ...$slots }">
		<slot v-bind="{ ...elSlots }"></slot>
	</component>
	<slot v-else></slot>
</template>

<script setup lang="ts">
	import type { Teleport } from "vue";

	import type { vComponent } from "../../types/plugin";

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
	withDefaults(
		defineProps<{
			/** Whether or not render the wrapper */
			wrap: boolean;
			/** Component or tag to render as wrapper */
			wrapper?: vComponent | typeof Teleport | string;
		}>(),
		{ wrapper: "div" }
	);
	/**
	 * TODO: improve type safety for scoped slots in wrapper
	 */
	defineSlots<{ default(v: Record<string, any>): void }>();
</script>
