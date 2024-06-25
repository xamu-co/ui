<template>
	<ul class="flx --flxColumn --minWidth-220" :class="classes">
		<li
			v-for="([childValueName, childValue], childValueIndex) in useSortObject(value)"
			:key="childValueIndex"
			class="flx --flxColumn --flx-center-start --gap-5 --flx-fit"
		>
			<span class="--txtSize-xs" :title="childValueName">
				{{ upperFirst(startCase(childValueName)) }}
			</span>
			<!-- Recursion -->
			<ValueComplex
				v-bind="{
					value: childValue,
					node,
					property: {
						value: childValueName,
						alias: upperFirst(startCase(childValueName)),
					},
					readonly,
					theme,
					modalProps: { theme, ...modalProps },
				}"
				:class="classes"
				verbose
			/>
		</li>
	</ul>
</template>
<script setup lang="ts" generic="P extends Record<string, any>">
	import startCase from "lodash-es/startCase";
	import upperFirst from "lodash-es/upperFirst";

	import type { iProperty, tProps } from "@open-xamu-co/ui-common-types";
	import { useSortObject } from "@open-xamu-co/ui-common-helpers";

	import ValueComplex from "./Complex.vue";

	import type { iModalProps, iUseThemeProps } from "../../types/props";
	import type { AllowedComponentProps } from "vue";

	interface iValueListProps extends iUseThemeProps {
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
	defineProps<iValueListProps>();
</script>
