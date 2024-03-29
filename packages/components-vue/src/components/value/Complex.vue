<template>
	<BaseErrorBoundary :theme="theme">
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
				:size="size"
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
							:size="size"
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
		<template
			v-else-if="typeof value === 'object' && value !== null && Object.keys(value).length"
		>
			<!-- Small object with small values -->
			<div
				v-if="
					Object.keys(value).length <= 3 &&
					Object.values(value).every((v) => typeof v === 'string' && v.length <= 7)
				"
				class="flx --flxRow --flx-start-center --gap-5"
			>
				<template
					v-for="([childValueName, childValue], childValueIndex) in useSortObject(value)"
					:key="childValueIndex"
				>
					<ValueSimple
						v-bind="{
							value: childValue,
							property: {
								value: childValueName,
								alias: _.capitalize(_.startCase(childValueName)),
							},
							readonly,
							theme,
							modalTheme,
							classes,
							verbose,
							size,
						}"
					/>
					<span v-if="childValueIndex < Object.keys(value).length - 1">⋅</span>
				</template>
			</div>
			<!-- Any other object -->
			<Modal v-else class="--txtSize" :theme="modalTheme || theme" :title="property?.alias">
				<template #toggle="{ toggleModal }">
					<ActionLink
						v-if="'name' in value"
						:theme="theme"
						:tooltip="t('see_value')"
						tooltip-as-text
						tooltip-position="bottom"
						:size="size"
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
						:size="size"
						round
						@click="toggleModal"
					>
						<IconFa name="lemon" />
						<IconFa name="lemon" force-regular />
					</ActionButtonToggle>
				</template>
				<template #default="{ model, invertedTheme }">
					<!-- Recursion -->
					<ValueList
						v-if="model"
						v-bind="{
							value,
							node,
							property,
							readonly,
							theme: invertedTheme,
							modalTheme: modalTheme || theme,
						}"
						:class="classes"
						verbose
					/>
				</template>
			</Modal>
		</template>
		<!-- Plain value -->
		<ValueSimple
			v-else
			v-bind="{ value, property, readonly, theme, modalTheme, classes, verbose, size }"
		/>
		<template #fallback?>
			<!-- Error fallback -->
			<span>{{ value ?? "-" }}</span>
		</template>
	</BaseErrorBoundary>
</template>
<script setup lang="ts">
	import _ from "lodash";

	import type {
		iProperty,
		tProp,
		tProps,
		tThemeModifier,
		tThemeTuple,
		tSizeModifier,
	} from "@open-xamu-co/ui-common-types";
	import { useI18n, useSwal } from "@open-xamu-co/ui-common-helpers";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import IconFa from "../icon/Fa.vue";
	import ActionLink from "../action/Link.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import ValueSimple from "./Simple.vue";
	import ValueList from "./List.vue";
	import Modal from "../Modal.vue";
	import Table from "../Table.vue";

	import type { iUseThemeProps } from "../../types/props";
	import useTheme from "../../composables/theme";
	import { useHelpers, useSortObject } from "../../composables/utils";

	interface iValueComplexProps extends iUseThemeProps {
		/**
		 * Cell value
		 */
		value: any;
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
		size?: tSizeModifier;
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
</script>
