<template>
	<!-- Array only -->
	<div
		v-if="Array.isArray(value)"
		class="flx --flxRow --flx-start-center --gap-5"
		:title="value.length ? t('table_quantity', value.length) : ''"
	>
		<ActionButton
			v-if="!readonly && property?.createNode"
			:theme="theme"
			:tooltip="t('table_create_new')"
			tooltip-as-text
			tooltip-position="bottom"
			round
			@click="createNodeAndRefresh"
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
			>
				<template #toggle="{ toggleModal }">
					<ActionButtonToggle
						:theme="theme"
						:aria-label="
							t('table_see_values', { name: property?.alias?.toLowerCase() })
						"
						size="sm"
						@click="toggleModal"
					>
						{{ t("table_see_values", { name: property?.alias?.toLowerCase() }) }}
					</ActionButtonToggle>
				</template>
				<template #default="{ model, invertedTheme }">
					<Table
						v-if="model"
						:nodes="remapValues(value)"
						:theme="invertedTheme"
						:modal-theme="modalTheme || theme"
						:classes="classes"
					/>
				</template>
			</Modal>
			<span v-else>{{ value.join(", ") }}</span>
		</template>
		<span v-else-if="!property?.createNode">-</span>
	</div>
	<!-- Object only -->
	<Modal
		v-else-if="typeof value === 'object' && value !== null && Object.keys(value).length"
		class="--txtSize"
		:theme="modalTheme || theme"
		:title="property?.alias"
	>
		<template #toggle="{ toggleModal }">
			<ActionLink
				v-if="'name' in value"
				:theme="theme"
				:tooltip="t('see_value')"
				tooltip-as-text
				tooltip-position="bottom"
				size="sm"
				@click="toggleModal"
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
				@click="toggleModal"
			>
				<IconFa name="lemon" />
				<IconFa name="lemon" force-regular />
			</ActionButtonToggle>
		</template>
		<template #default="{ model, invertedTheme }">
			<ul v-if="model" class="flx --flxColumn --minWidth-220 --txtSize-sm" :class="classes">
				<li
					v-for="([childValueName, childValue], childValueIndex) in sort(value)"
					:key="childValueIndex"
					class="flx --flxColumn --flx-center-start --gap-5 --flx-fit"
				>
					<span class="--txtSize-xs">
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
							readonly,
							theme: invertedTheme,
							modalTheme: modalTheme || theme,
						}"
						:class="classes"
						verbose
					/>
				</li>
			</ul>
		</template>
	</Modal>
	<!-- Plain value -->
	<ValueSimple
		v-else
		v-bind="{ value, property, readonly, theme, modalTheme, classes, verbose }"
	/>
</template>
<script setup lang="ts" generic="P extends Record<string, any>, T">
	import _ from "lodash";

	import type {
		iProperty,
		tProp,
		tProps,
		tThemeModifier,
		tThemeTuple,
	} from "@open-xamu-co/ui-common-types";
	import { useI18n, useSwal } from "@open-xamu-co/ui-common-helpers";

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

	interface iValueComplexProps<Pi extends Record<string, any>, Ti> extends iUseThemeProps {
		/**
		 * Cell value
		 */
		value: Ti;
		/**
		 * Cell column property
		 */
		property?: iProperty<Pi>;
		/**
		 * Cell node, aka parent node
		 *
		 * The value prop will be a property of this node
		 */
		node?: Pi;
		readonly?: boolean;
		classes?: tProps<string>;
		/**
		 * Refresh the content
		 */
		refresh?: () => unknown;
		modalTheme?: tThemeTuple | tProp<tThemeModifier>;
		/**
		 * Prevent node functions from triggering refresh event (useful with firebase hydration)
		 */
		omitRefresh?: boolean;
		verbose?: boolean;
	}

	/**
	 * Complex value
	 *
	 * @component
	 */

	defineOptions({ name: "ValueComplex", inheritAttrs: false });

	const props = defineProps<iValueComplexProps<P, T>>();

	const { themeValues } = useTheme(props);
	const { t } = useHelpers(useI18n);
	const Swal = useHelpers(useSwal);

	function remapValues(values: unknown[]): Record<string, any>[] {
		return values.map((value) => {
			return typeof value === "object" && value !== null ? value : { value };
		});
	}

	/**
	 * Creates given node
	 * sometimes it could fail but still create (api issue)
	 */
	async function createNodeAndRefresh() {
		// display loader
		Swal.fireLoader();

		// run process
		const created = await props.property?.createNode?.(props.node);

		// unfinished task
		if (created === undefined) {
			if (Swal.isLoading()) Swal.close();

			return;
		}

		if (created) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_created"),
			});
		} else {
			Swal.fire({
				icon: "warning",
				title: t("swal.table_created"),
				text: t("swal.table_possibly_not_created"),
			});
		}

		if (!props.omitRefresh) props.refresh?.();
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
