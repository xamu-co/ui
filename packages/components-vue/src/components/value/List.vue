<template>
	<ul class="flx --flxColumn --minWidth-220" :class="classes">
		<li
			v-for="([childValueName, childValue], childValueIndex) in useSortObject(value)"
			:key="childValueIndex"
			class="flx --flxColumn --flx-center-start --gap-5 --flx-fit"
		>
			<span class="--txtSize-xs">
				{{ _.capitalize(_.startCase(childValueName)) }}
			</span>
			<!-- Recursion -->
			<ValueComplex
				v-bind="{
					value: childValue,
					node,
					property: {
						value: childValueName,
						alias: _.capitalize(_.startCase(childValueName)),
					},
					readonly,
					theme,
					modalTheme: modalTheme || theme,
				}"
				:class="classes"
				verbose
			/>
		</li>
	</ul>
</template>
<script setup lang="ts" generic="P extends Record<string, any>">
	import _ from "lodash";

	import type {
		iProperty,
		tProp,
		tProps,
		tThemeModifier,
		tThemeTuple,
	} from "@open-xamu-co/ui-common-types";

	import ValueComplex from "./Complex.vue";

	import type { iUseThemeProps } from "../../types/props";
	import { useSortObject } from "../../composables/utils";

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
		modalTheme?: tThemeTuple | tProp<tThemeModifier>;
	}

	/**
	 * Complex value
	 *
	 * @component
	 */

	defineOptions({ name: "ValueList", inheritAttrs: false });
	defineProps<iValueListProps>();
</script>
