<template>
	<!-- Array only -->
	<div
		v-if="Array.isArray(value)"
		class="flx --flxRow --flx-start-center --gap-5"
		:title="value.length ? t('table_quantity', value.length) : ''"
	>
		<ActionButton
			v-if="!readOnly && createFn"
			:theme="theme"
			:tooltip="t('table_create_new')"
			tooltip-as-text
			tooltip-position="bottom"
			round
			@click="triggerUpdate(createFn())"
		>
			<IconFa name="plus" />
		</ActionButton>
		<template v-if="value.length">
			<span class="--txtWrap-nowrap">
				<b :class="`--txtColor-${themeValues[0]}`">{{ value.length }}</b>
				⋅
			</span>
			<Modal
				v-if="value.every((v) => typeof v === 'object') || value.length > 3"
				class="--txtSize"
				:theme="modalTheme || theme"
				:title="property?.alias"
				:target="modalTarget"
			>
				<template #toggle="{ setModel }">
					<ActionButtonToggle
						:theme="theme"
						:aria-label="
							t('table_see_values', { name: property?.alias?.toLowerCase() })
						"
						size="sm"
						@click="setModel()"
					>
						{{ t("table_see_values", { name: property?.alias?.toLowerCase() }) }}
					</ActionButtonToggle>
				</template>
				<template #default="{ model }">
					<Table
						v-if="model"
						:nodes="remapValues(value)"
						:theme="theme"
						:modal-theme="modalTheme"
						:classes="classes"
					/>
				</template>
			</Modal>
			<span v-else>{{ value.join(", ") }}</span>
		</template>
		<span v-else-if="!createFn">-</span>
	</div>
	<!-- Object only -->
	<Modal
		v-else-if="typeof value === 'object' && value !== null && Object.keys(value).length"
		class="--txtSize"
		:theme="modalTheme || theme"
		:title="property?.alias"
		:target="modalTarget"
	>
		<template #toggle="{ setModel }">
			<ActionLink
				v-if="'name' in value"
				:theme="theme"
				:tooltip="t('see_value')"
				tooltip-as-text
				tooltip-position="bottom"
				size="sm"
				@click="setModel()"
			>
				<IconFa name="lemon" force-regular />
				<span>{{ value.name }}</span>
			</ActionLink>
			<ActionButtonToggle
				v-else
				:theme="theme"
				:tooltip="t('see_value')"
				tooltip-as-text
				tooltip-position="bottom"
				size="sm"
				round
				@click="setModel()"
			>
				<IconFa name="lemon" />
				<IconFa name="lemon" force-regular />
			</ActionButtonToggle>
		</template>
		<template #default="{ model }">
			<ul v-if="model" class="flx --flxColumn --minWidth-220 --txtSize-sm" :class="classes">
				<li
					v-for="([childValueName, childValue], childValueIndex) in sort(value)"
					:key="childValueIndex"
					class="flx --flxColumn --flx-center-start --gap-5 --flx-fit"
				>
					<span class="--txtSize-xs" :class="`--txtColor-${themeValues[0]}`">
						{{ _.capitalize(_.startCase(childValueName)) }}
					</span>
					<!-- Recursion -->
					<Complex
						v-bind="{
							value: childValue,
							node,
							property: {
								value: childValueName,
								alias: _.capitalize(_.startCase(childValueName)),
							},
							readOnly,
							theme,
							modalTheme,
							modalTarget,
						}"
						:class="classes"
					/>
				</li>
			</ul>
		</template>
	</Modal>
	<!-- Plain value -->
	<ValueSimple
		v-else
		v-bind="{ value, property, readOnly, theme, modalTheme, classes, modalTarget }"
	/>
</template>
<script setup lang="ts">
	import { RendererElement } from "vue";
	import _ from "lodash";

	import type {
		iSelectOption,
		tProp,
		tProps,
		tThemeModifier,
		tThemeTuple,
	} from "@open-xamu-co/ui-common-types";
	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionLink from "../action/Link.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import ValueSimple from "./Simple.vue";
	import Modal from "../Modal.vue";
	import Table from "../Table.vue";

	import type { iUseThemeProps } from "../../types/props";
	import useTheme from "../../composables/theme";
	import useHelpers from "../../composables/helpers";

	interface iValueComplexProps extends iUseThemeProps {
		/**
		 * Cell value
		 */
		value: unknown;
		/**
		 * Cell column property
		 */
		property?: iSelectOption;
		/**
		 * Cell node
		 */
		node?: Record<string, unknown>;
		readOnly?: boolean;
		readFn?: () => Promise<boolean>;
		createFn?: () => Promise<boolean>;
		deleteFn?: () => Promise<boolean>;
		classes?: tProps<string>;
		/**
		 * Refresh the content
		 */
		refresh?: () => unknown;
		modalTarget?: string | RendererElement;
		modalTheme?: tThemeTuple | tProp<tThemeModifier>;
	}

	/**
	 * Complex value
	 *
	 * @component
	 */

	defineOptions({ name: "ValueComplex", inheritAttrs: false });

	const props = defineProps<iValueComplexProps>();

	const { themeValues } = useTheme(props);
	const { t } = useHelpers(useI18n);

	function remapValues(values: unknown[]) {
		return values.map((value) => {
			return typeof value === "object" && value !== null ? value : { value };
		});
	}

	async function triggerUpdate(promise?: Promise<boolean>) {
		if (!(await promise)) return;

		props.refresh?.();
	}

	function sort(data: Record<string, any>) {
		return Object.entries(data)
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
	}
</script>
