<template>
	<i
		aria-hidden="true"
		:class="
			getClassesString([
				modifiersClasses,
				indicatorClasses,
				!!$slots.default ? 'svg' : 'icon',
			])
		"
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

	const { getClassesString, getModifierClasses: GMC } = useHelpers(useUtils);
	const { modifiersClasses } = useModifiers(props);

	const indicatorClasses = computed<string[]>(() => {
		return props.indicator ? GMC(["indicator"]) : [];
	});
</script>
