<template>
	<!-- Action bar -->
	<thead>
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
								class="--sticky"
								:class="{ '--pBottom-10': !nested }"
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
								:class="{ '--pBottom-10': !nested }"
								:colspan="propertiesMeta.length"
								width="99%"
							></td>
							<th
								v-if="!isReadOnly && nodes.length > 1 && deleteNode"
								class="--sticky"
								:class="{ '--pBottom-10': !nested }"
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
	</thead>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonLink from "../action/ButtonLink.vue";

	import type { iTableChildProps } from "../../types/props";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";

	export interface iTableHeadProps<Ti extends Record<string, any>> extends iTableChildProps<Ti> {
		withDefaultSlot: boolean;
	}

	/**
	 * Table head actions
	 *
	 * @component
	 */

	defineOptions({ name: "TableHeadActions", inheritAttrs: false });

	const props = defineProps<iTableHeadProps<T>>();

	const { t } = useHelpers(useI18n);
	const { themeClasses, dangerThemeValues } = useTheme(props);
</script>
