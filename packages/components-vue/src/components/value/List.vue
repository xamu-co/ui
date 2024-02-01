<template>
	<ul class="flx --flxColumn --minWidth-220" :class="classes">
		<li
			v-for="([childValueName, childValue], childValueIndex) in sorted"
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
	import { computed } from "vue";

	import type {
		iProperty,
		tProp,
		tProps,
		tThemeModifier,
		tThemeTuple,
	} from "@open-xamu-co/ui-common-types";

	import ValueComplex from "./Complex.vue";

	import type { iUseThemeProps } from "../../types/props";

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

	const props = defineProps<iValueListProps>();

	const sorted = computed(() => {
		return Object.entries(props.value)
			.sort(([a], [b]) => {
				// updatedAt, updatedBy, createdAt and createdBy to last position
				if (a.endsWith("At") || a.endsWith("By") || b.endsWith("At") || b.endsWith("By")) {
					if (a.endsWith("At") || a.endsWith("By")) return 1;

					return -1;
				} else if (a > b) return 1;
				else if (a < b) return -1;

				return 0;
			})
			.filter(([property]) => property !== "id");
	});
</script>
