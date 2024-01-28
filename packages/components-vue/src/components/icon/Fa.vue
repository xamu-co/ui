<template>
	<IconSimple
		:class="[`fa-${name ?? 'cubes'}`, typeClass]"
		v-bind="{ ...$attrs, hidden, size, indicator }"
	/>
</template>

<script setup lang="ts">
	import type { IconName } from "@fortawesome/fontawesome-common-types";
	import { computed, inject } from "vue";

	import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

	import IconSimple from "./Simple.vue";

	import type { iUseModifiersProps } from "../../types/props";

	interface iIconFaProps extends iUseModifiersProps {
		name?: IconName;
		regular?: boolean;
		brand?: boolean;
		indicator?: boolean;
		/**
		 * For free icons with regular version
		 */
		forceRegular?: boolean;
	}

	/**
	 * FontAwesome Icon
	 *
	 * @component
	 * @example
	 * <IconFa size="50" name="cubes" />
	 */

	defineOptions({ name: "IconFa", inheritAttrs: false });

	const props = defineProps<iIconFaProps>();

	const xamuOptions = inject<iPluginOptions>("xamu");

	const regular = computed(() => {
		return props.forceRegular || (xamuOptions?.fontAwesomePro && props.regular);
	});

	/**
	 * Free version of FA only delivers brand, solid and regular
	 * Assumes solid as default
	 */
	const typeClass = computed<string>(() => {
		return (props.brand && "fab") || (regular.value && "far") || "fas";
	});
</script>
