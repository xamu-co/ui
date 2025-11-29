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
				:disabled="!!property?.disableCreateNode?.(node)"
				round
				@click="createNodeAndRefresh"
			>
				<IconFa name="plus" />
			</ActionButton>
			<template v-if="value.length">
				<div class="--txtWrap-nowrap">
					{{ !readonly && property?.createNode ? "⋅" : "" }}
					<b :class="`--txtColor-${themeValues[0]}`">{{ value.length }}</b>
					⋅
				</div>
				<Modal
					v-if="value.every((v) => typeof v === 'object') || value.length > 3"
					class="--txtSize"
					:title="property?.alias"
					v-bind="{ theme, ...modalProps }"
				>
					<template #toggle="{ toggleModal }">
						<component
							:is="property?.updateNode ? ActionButton : ActionButtonToggle"
							:theme="theme"
							:size="size"
							@click="toggleModal"
						>
							{{ t("table_see_values", { name: property?.alias?.toLowerCase() }) }}
						</component>
					</template>
					<template #default="{ model, invertedTheme }">
						<TableSimple
							v-if="model"
							:nodes="remapValues(value)"
							:theme="invertedTheme"
							:modal-props="{ theme, ...modalProps }"
							:classes="classes"
							:clone-node="property?.cloneNode || undefined"
							:update-node="property?.updateNode"
							:delete-node="property?.deleteNode"
						/>
					</template>
				</Modal>
				<div v-else class="flx --flxRow --flx-start-center --gap-5">
					<template v-for="(childValue, childIndex) in value" :key="childIndex">
						<ValueSimple
							v-bind="{
								value: childValue,
								property,
								readonly,
								theme,
								modalProps,
								classes,
								verbose,
								size,
							}"
						/>
						<span v-if="childIndex < value.length - 1">⋅</span>
					</template>
				</div>
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
					v-for="([childKey, childValue], childIndex) in useSortObject(value)"
					:key="childIndex"
				>
					<ValueSimple
						v-bind="{
							value: childValue,
							property: {
								value: childKey,
								alias: upperFirst(startCase(tet(snakeCase(childKey)))),
							},
							readonly,
							theme,
							modalProps,
							classes,
							verbose,
							size,
						}"
					/>
					<span v-if="childIndex < Object.keys(value).length - 1">⋅</span>
				</template>
			</div>
			<!-- Any other object -->
			<Modal
				v-else
				class="--txtSize"
				:title="property?.alias"
				v-bind="{ theme, ...modalProps }"
			>
				<template #toggle="{ toggleModal }">
					<ActionLink
						v-if="'name' in value || 'slug' in value"
						:theme="theme"
						:tooltip="t('see_value')"
						tooltip-as-text
						tooltip-position="bottom"
						:size="size"
						@click="toggleModal"
					>
						<IconFa name="lemon" force-regular />
						<span>{{ value.name || value.slug }}</span>
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
							modalProps: { theme, ...modalProps },
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
			v-bind="{ value, property, readonly, theme, modalProps, classes, verbose, size }"
		/>
		<template #fallback?>
			<!-- Error fallback -->
			<span class="--txtColor-danger">{{ value ?? "-" }}</span>
		</template>
	</BaseErrorBoundary>
</template>
<script setup lang="ts">
	import upperFirst from "lodash-es/upperFirst";
	import startCase from "lodash-es/startCase";
	import snakeCase from "lodash-es/snakeCase";

	import { useI18n, useSwal, useSortObject } from "@open-xamu-co/ui-common-helpers";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import IconFa from "../icon/Fa.vue";
	import ActionLink from "../action/Link.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import ValueSimple from "./Simple.vue";
	import ValueList from "./List.vue";
	import Modal from "../modal/Simple.vue";
	import TableSimple from "../table/Simple.vue";

	import type { iValueComplexProps } from "../../types/props";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";

	/**
	 * Complex value
	 *
	 * @component
	 */

	defineOptions({ name: "ValueComplex", inheritAttrs: false });

	const props = defineProps<iValueComplexProps>();

	const { themeValues } = useTheme(props);
	const { t, tet } = useHelpers(useI18n);
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
	async function createNodeAndRefresh(target: Event) {
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
				target,
			});
		} else {
			Swal.fire({
				icon: "warning",
				title: t("swal.table_created"),
				text: t("swal.table_possibly_not_created"),
				target,
			});
		}

		if (!props.omitRefresh) props.refresh?.();
	}
</script>
