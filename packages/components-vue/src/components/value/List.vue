<template>
	<ul class="flx --flxColumn --minWidth-220" :class="classes">
		<template v-for="(item, itemIndex) in list" :key="itemIndex">
			<li v-if="!item.hidden" class="flx --flxColumn --flx-center-start --gap-5 --flx-fit">
				<span class="--txtSize-xs" :title="item.key">{{ item.alias }}</span>
				<!-- Recursion -->
				<component
					:is="item.component || ValueComplex"
					v-bind="{
						value: item.value,
						node,
						property: {
							...item,
							value: item.key,
							alias: item.alias,
						},
						properties,
						readonly,
						theme,
						modalProps: { theme, ...modalProps },
						classes,
					}"
					:class="classes"
					class="--txtWrap"
					verbose
				/>
			</li>
		</template>
	</ul>
</template>
<script setup lang="ts">
	import startCase from "lodash-es/startCase";
	import upperFirst from "lodash-es/upperFirst";
	import snakeCase from "lodash-es/snakeCase";
	import { type AllowedComponentProps, computed, defineAsyncComponent } from "vue";

	import type { iProperty, tProps } from "@open-xamu-co/ui-common-types";
	import { useSortObject, useI18n, toOption } from "@open-xamu-co/ui-common-helpers";

	import LoaderSimple from "../loader/Simple.vue";

	import type { iModalProps, iUseThemeProps, iValueComplexProps } from "../../types/props";
	import type { vComponent } from "../../plugin";
	import { useHelpers } from "../../composables/utils";

	const ValueComplex = defineAsyncComponent({
		loader: () => import("./Complex.vue"),
		loadingComponent: LoaderSimple,
	});

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

	export interface iValueListPropertyList extends iProperty<
		any,
		any,
		vComponent<iValueComplexProps>
	> {
		key: string;
	}

	/**
	 * Complex value
	 *
	 * @component
	 */

	defineOptions({ name: "ValueList", inheritAttrs: false });

	const props = defineProps<
		iValueListProps & {
			/**
			 * Inherited table properties (Cell properties)
			 * @internal
			 */
			properties?: iProperty<any, any, vComponent<iValueComplexProps>>[];
		}
	>();

	const { tet } = useHelpers(useI18n);

	const list = computed<iValueListPropertyList[]>(() => {
		// Get meta defaults
		const options = (props.properties || []).map(toOption);

		return useSortObject(props.value).map(([key, value]) => {
			const property = options.find((p) => p.value === key) || toOption(key);
			const aliasKey = snakeCase(key);

			return {
				...property, // Get defaults
				key, // Object property key
				value, // Object property value
				alias: upperFirst(startCase(property.alias || tet(aliasKey))),
			};
		});
	});
</script>
