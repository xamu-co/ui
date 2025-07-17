<template>
	<thead>
		<!-- Action bar -->
		<tr
			v-if="(!isReadOnly && nodes.length > 1) || withDefaultSlot || $slots.headActions"
			class="no--hover"
		>
			<td :colspan="propertiesMeta.length + 2">
				<!-- Sticky scrolling fix  -->
				<table :id="`bulk_${tableId}`" class="tbl tbl-helper" :class="themeClasses">
					<tbody>
						<tr class="no--hover">
							<th
								v-if="withDefaultSlot || $slots.headActions"
								class="--sticky --pBottom-10"
							>
								<div
									class="flx --flxRow --flx-start-center --gap-10 --gap:md --flx"
								>
									<ActionButtonLink
										v-if="
											withDefaultSlot &&
											nodes.length > 1 &&
											nodes.some(childrenCount)
										"
										:theme="theme"
										:active="openNodesCount === selectedNodes.length"
										round=":sm-inv"
										@click="
											() =>
												toggleAll(
													!(openNodesCount === selectedNodes.length),
													1
												)
										"
									>
										<span class="--hidden-full:sm-inv">
											{{
												openNodesCount === selectedNodes.length
													? t("table_hide_all")
													: t("table_show_all")
											}}
										</span>
										<IconFa class="--indicator" name="chevron-up" />
									</ActionButtonLink>
									<slot
										name="headActions"
										v-bind="{
											nodes,
											updateNodeAndRefresh,
											cloneNodeAndRefresh,
											deleteNodeAndRefresh,
											deleteNodesAndRefresh,
										}"
									></slot>
								</div>
							</th>
							<td
								class="--pBottom-10"
								:colspan="propertiesMeta.length"
								width="99%"
							></td>
							<th
								v-if="!isReadOnly && nodes.length > 1 && deleteNode"
								class="--sticky --pBottom-10"
								colspan="0"
								width="1px"
							>
								<div class="flx --flxRow --flx-end-center --gap-10 --gap:md --flx">
									<ActionButton
										:tooltip="t('table_delete')"
										tooltip-as-text
										tooltip-position="bottom"
										:theme="dangerThemeValues"
										:disabled="!selectedNodes.some(([n]) => n)"
										round=":sm-inv"
										@click="() => deleteNodesAndRefresh()"
									>
										<span class="--hidden-full:sm-inv">
											{{
												selectedNodesCount === selectedNodes.length
													? t("delete_all")
													: t("delete", selectedNodesCount)
											}}
										</span>
										<IconFa name="trash-can" />
									</ActionButton>
								</div>
							</th>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
		<!-- Table header -->
		<tr v-if="nodes.length" class="--txtAlign" :class="`--txtSize-${size}`">
			<!-- TODO: define filters, filter table contents -->
			<th
				v-if="nodes.length > 1 || withDefaultSlot"
				class="--sticky"
				:class="{ ['is--selected']: sort && !!ordering['id'] }"
				data-column-name="id"
				data-column="id"
			>
				<div class="flx --flxRow --flx-start-center --gap-10">
					<InputToggle
						v-if="!isReadOnly"
						:id="tableId + 'select-all'"
						:theme="theme || themeValues"
						:title="t('table_select_all')"
						:checked="selectedNodes.every(([n]) => n)"
						:size="size"
						@update:model-value="toggleAll"
					/>
					<span v-if="!sort">#</span>
					<ActionLink
						v-else
						:theme="theme || themeValues"
						title="id"
						:tooltip="t('table_sort_by_name', { name: 'Id' })"
						tooltip-as-text
						tooltip-position="bottom"
						:size="size"
						@click="() => setOrdering('id')"
					>
						<span>#</span>
						<template v-if="!!ordering['id']">
							<IconFa v-if="ordering['id'] === 'asc'" name="arrow-down" />
							<IconFa v-else name="arrow-up" />
						</template>
					</ActionLink>
				</div>
			</th>
			<template v-for="(meta, metaIndex) in propertiesMeta" :key="metaIndex">
				<td
					v-if="!meta.hidden"
					class="--maxWidth-440"
					:class="[
						`--txtSize-${size}`,
						{ ['is--selected']: meta.canSort && !!ordering[meta.value] },
					]"
					:data-column-name="meta.value"
					:data-column="meta.alias"
					:width="nested && metaIndex === propertiesMeta.length - 1 ? '99%' : 'auto'"
				>
					<span v-if="!meta.canSort" :title="meta.value">
						{{ meta.alias }}
					</span>
					<ActionLink
						v-else
						:theme="theme || themeValues"
						:title="meta.value"
						:tooltip="t('table_sort_by_name', { name: meta.alias })"
						tooltip-as-text
						tooltip-position="bottom"
						:size="size"
						@click="() => setOrdering(meta.value)"
					>
						<span>{{ meta.alias }}</span>
						<template v-if="!!ordering[meta.value]">
							<IconFa v-if="ordering[meta.value] === 'asc'" name="arrow-down" />
							<IconFa v-else name="arrow-up" />
						</template>
					</ActionLink>
				</td>
			</template>
			<th
				v-if="!isReadOnly && (!!updateNode || !!deleteNode || !!cloneNode)"
				class="--sticky --txtAlign-center"
				data-column-name="modify"
				data-column="modify"
			>
				<span>
					{{ t("table_modify") }}
				</span>
			</th>
		</tr>
	</thead>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionLink from "../action/Link.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonLink from "../action/ButtonLink.vue";
	import InputToggle from "../input/Toggle.vue";

	import type { iTableChildProps } from "../../types/props";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";

	export interface iTableHeadProps<Ti extends Record<string, any>> extends iTableChildProps<Ti> {
		withDefaultSlot: boolean;
	}

	/**
	 * Table head
	 *
	 * @component
	 */

	defineOptions({ name: "TableHead", inheritAttrs: false });

	const props = defineProps<iTableHeadProps<T>>();

	const { t } = useHelpers(useI18n);
	const { themeClasses, themeValues, dangerThemeValues } = useTheme(props);
</script>
