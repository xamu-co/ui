<template>
	<ul class="flx --flxColumn --minWidth-220" :class="classes">
		<li
			v-for="(child, childIndex) in list"
			:key="childIndex"
			class="flx --flxColumn --flx-center-start --gap-5 --flx-fit"
		>
			<span class="--txtSize-xs" :title="child.key">{{ child.alias }}</span>
			<!-- Recursion -->
			<ValueComplex
				v-bind="{
					value: child.value,
					node,
					property: {
						value: child.key,
						alias: child.alias,
					},
					readonly,
					theme,
					modalProps: { theme, ...modalProps },
				}"
				:class="classes"
				class="--txtWrap"
				verbose
			/>
		</li>
	</ul>
</template>
<script setup lang="ts">
	import startCase from "lodash-es/startCase";
	import upperFirst from "lodash-es/upperFirst";
	import snakeCase from "lodash-es/snakeCase";
	import { type AllowedComponentProps, computed } from "vue";

	import type { iProperty, tProps } from "@open-xamu-co/ui-common-types";
	import { useSortObject, useI18n } from "@open-xamu-co/ui-common-helpers";

	import ValueComplex from "./Complex.vue";

	import type { iModalProps, iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";

	export interface iValueListProps extends iUseThemeProps {
		/**
		 * Cell value
		 */
		value: Record<string, any>;
		/**
		 * Cell column property
		 */
		property?: iProperty;
		/**
		 * Cell node, aka parent node
		 *
		 * The value prop will be a property of this node
		 */
		node?: Record<string, any>;
		readonly?: boolean;
		classes?: tProps<string>;
		modalProps?: iModalProps & AllowedComponentProps;
	}

	/**
	 * Complex value
	 *
	 * @component
	 */

	defineOptions({ name: "ValueList", inheritAttrs: false });

	const props = defineProps<iValueListProps>();

	const { tet } = useHelpers(useI18n);

	const list = computed(() => {
		return useSortObject(props.value).map(([key, value]) => {
			return {
				key,
				value,
				alias: upperFirst(startCase(tet(snakeCase(key)))),
			};
		});
	});
</script>
