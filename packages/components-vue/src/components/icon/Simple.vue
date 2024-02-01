<template>
	<i
		aria-hidden="true"
		:class="[modifiersClasses, indicatorClasses, !!$slots.default ? 'svg' : 'icon']"
		v-bind="$attrs"
	>
		<slot></slot>
	</i>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	import { useUtils } from "@open-xamu-co/ui-common-helpers";

	import type { iUseModifiersProps } from "../../types/props";
	import useModifiers from "../../composables/modifiers";
	import useHelpers from "../../composables/helpers";

	interface iIconSimpleProps extends iUseModifiersProps {
		indicator?: boolean;
		size?: number;
	}

	/**
	 * Icon
	 *
	 * @component
	 * @example
	 * <Icon size="50" />
	 */

	defineOptions({ name: "IconSimple", inheritAttrs: false });

	const props = defineProps<iIconSimpleProps>();

	const { getModifierClasses: GMC } = useHelpers(useUtils);
	const { modifiersClasses } = useModifiers(props);

	const indicatorClasses = computed<string[]>(() => {
		return props.indicator ? GMC(["indicator"]) : [];
	});
</script>
