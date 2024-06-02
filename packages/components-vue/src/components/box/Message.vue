<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="flx --flxColumn --flx-center" :class="$attrs.class">
		<div class="txt --txtAlign-center --width">
			<BaseBox class="--width" with-color v-bind="props">
				<p v-if="text" v-html="text"></p>
				<slot v-else></slot>
			</BaseBox>
		</div>
	</div>
</template>

<script setup lang="ts">
	import BaseBox from "../base/Box.vue";

	import type {
		iUseModifiersProps,
		iUseStateProps,
		iUseThemeProps,
		iActionProps,
	} from "../../types/props";

	interface iBoxMessageProps
		extends iActionProps,
			iUseModifiersProps,
			iUseStateProps,
			iUseThemeProps {
		/**
		 * Text or html
		 */
		text?: string;
	}

	/**
	 * BoxMessage
	 * Displays a box with a message
	 * Useful for warnings or just general info
	 *
	 * @component
	 * @example
	 * <BoxMessage name="50"></BoxMessage>
	 */

	defineOptions({ name: "BoxMessage", inheritAttrs: false });

	const props = defineProps<iBoxMessageProps>();
</script>
