<template>
	<tbody v-if="mappedNodes.length" :class="classes">
		<template
			v-for="(
				{ node, index, visibility, hydrateNode, createNodeChildrenAndRefresh }, mappedIndex
			) in mappedNodes.nodes"
			:key="index"
		>
			<!-- Row -->
			<tr
				class="--txtAlign"
				:class="[`--txtSize-${size}`, { ['is--selected']: selectedNodes[index][0] }]"
			>
				<th
					v-if="mappedNodes.length > 1 || $slots.default"
					class="--sticky"
					:class="{ ['is--selected']: !!ordering['id'] }"
					data-column-name="id"
					data-column="id"
				>
					<component
						:is="preferId"
						v-if="preferId && preferId !== true"
						v-bind="{ index, node: nodes[index] }"
					/>
					<div v-else class="flx --flxRow --flx-start-center --gap-10">
						<InputToggle
							v-if="!isReadOnly"
							:id="tableId + String(node.id ?? index)"
							v-model="selectedNodes[mappedIndex][0]"
							:theme="theme || themeValues"
							:title="t('table_select')"
							:size="size"
						/>
						<span :title="String(node.id ?? index)">
							{{ node.id && preferId ? node.id : index + 1 }}
						</span>
					</div>
				</th>
				<template v-for="meta in propertiesMeta" :key="meta.value">
					<td
						v-if="!meta.hidden"
						:data-column-name="meta.value"
						:data-column="meta.alias"
						:class="[
							`--txtSize-${size}`,
							{ ['is--selected']: ordering.name === meta.value },
						]"
						class="--maxWidth-440"
					>
						<component
							:is="meta.component || ValueComplex"
							v-bind="{
								value: node[meta.value],
								meta: {
									...meta,
									...(meta.updateNode && {
										updateNode: (n: any) => meta.updateNode?.(n, nodes[index]),
									}),
								},
								node: nodes[index],
								mappedNode: node,
								readonly: isReadOnly,
								theme: theme || themeValues,
								modalProps: { theme: theme || themeValues, ...modalProps },
								classes,
								refresh,
								omitRefresh,
								size,
								hydrateNode,
							}"
						/>
					</td>
				</template>
				<th
					v-if="
						!isReadOnly &&
						(!!updateNode ||
							!!deleteNode ||
							!!cloneNode ||
							$slots.modifyActions ||
							$slots.modifyDropdownActions)
					"
					class="--sticky --txtAlign-center"
					data-column-name="modify"
					:data-column="t('table_modify')"
				>
					<div class="flx --flxRow --flx-center --gap-10">
						<slot
							name="modifyActions"
							v-bind="{
								node: nodes[index],
								mappedNode: node,
								updateNodeAndRefresh,
								cloneNodeAndRefresh,
								deleteNodeAndRefresh,
								deleteNodesAndRefresh,
								show: canShowChildren(visibility, mappedIndex),
							}"
						></slot>
						<ActionButton
							v-if="!!updateNode"
							:tooltip="t('table_update')"
							tooltip-as-text
							tooltip-position="left"
							:theme="theme || themeValues"
							:size="size"
							round
							:disabled="selectedNodes.some(([n]) => n)"
							@click="() => updateNodeAndRefresh(nodes[index])"
						>
							<IconFa name="pencil" />
						</ActionButton>
						<Dropdown
							v-if="!!deleteNode || !!cloneNode || $slots.modifyDropdownActions"
							class="flx --flxRow --flx-center"
							:position="['left', 'center']"
							:size="size"
							v-bind="{ theme: theme || themeValues, ...modalProps }"
						>
							<template #toggle="{ setModel }">
								<ActionLink
									class="--pX-10"
									:aria-label="t('table_options')"
									:title="t('table_options')"
									:theme="theme || themeValues"
									:size="size"
									:disabled="selectedNodes.some(([n]) => n)"
									toggle="dropdown"
									@click="() => setModel()"
								>
									<IconFa name="ellipsis-vertical" />
								</ActionLink>
							</template>
							<template #default="{ setModel, invertedTheme, dropdownRef }">
								<ul class="flx --flxColumn --flx-start-stretch --gap-10">
									<li v-if="!!cloneNode">
										<ActionLink
											:theme="invertedTheme"
											:size="size"
											:aria-label="t('table_duplicate')"
											@click="
												() => cloneNodeAndRefresh(nodes[index], setModel)
											"
										>
											<IconFa name="clone" />
											<span>
												{{ t("table_duplicate") }}
											</span>
										</ActionLink>
									</li>
									<li v-if="!!deleteNode">
										<ActionLink
											:theme="dangerThemeValues"
											:size="size"
											:aria-label="t('table_delete')"
											@click="
												() =>
													deleteNodeAndRefresh(
														nodes[index],
														setModel,
														dropdownRef
													)
											"
										>
											<IconFa name="trash-can" />
											<span>{{ t("table_delete") }}</span>
										</ActionLink>
									</li>
									<slot
										name="modifyDropdownActions"
										v-bind="{
											node: nodes[index],
											mappedNode: node,
											updateNodeAndRefresh,
											cloneNodeAndRefresh,
											deleteNodeAndRefresh,
											deleteNodesAndRefresh,
											show: canShowChildren(visibility, mappedIndex),
										}"
									></slot>
								</ul>
							</template>
						</Dropdown>
					</div>
				</th>
			</tr>
			<!-- Row children (Nested table) -->
			<template v-if="$slots.default">
				<!-- Row children content -->
				<tr class="no--hover --width-100">
					<td :colspan="propertiesMeta.length + 2">
						<BaseBox
							v-show="canShowChildren(visibility, mappedIndex)"
							:theme="theme || themeValues"
							transparent
							button
							solid
						>
							<slot
								v-bind="{
									node: nodes[index],
									mappedNode: node,
									updateNodeAndRefresh,
									cloneNodeAndRefresh,
									deleteNodeAndRefresh,
									deleteNodesAndRefresh,
									createNodeChildrenAndRefresh,
									show: canShowChildren(visibility, mappedIndex),
									hydrateParentNode: hydrateNode,
								}"
							></slot>
						</BaseBox>
					</td>
				</tr>
				<!-- Row children actions (Acts as a divider of rows when children are hidden) -->
				<tr class="no--hover">
					<th class="--sticky --pX-10 --pY-5 --vAlign">
						<div class="flx --flxRow --flx-end-center --gap-10 --bdr">
							<ActionLink
								:theme="theme || themeValues"
								:size="size"
								:active="canShowChildren(visibility, mappedIndex)"
								:tooltip="
									t(
										canShowChildren(visibility, mappedIndex)
											? 'table_hide_name'
											: 'table_see_name',
										{
											name:
												childrenName ||
												childrenCountKey ||
												String(node.id ?? index).split('/')[0],
										}
									)
								"
								tooltip-position="right"
								:disabled="!visibility.childrenCount || visibility.showNodeChildren"
								class="--p-5"
								@click="() => toggleChildren(mappedIndex)"
							>
								<span v-if="visibility.childrenCount >= 1">
									{{ visibility.childrenCount }}
								</span>
								<IconFa name="chevron-down" indicator />
							</ActionLink>
							<ActionButtonLink
								v-if="createNodeChildren"
								:theme="theme || themeValues"
								:size="size"
								:disabled="visibility.disableCreateNodeChildren"
								:tooltip="
									t('table_create_new_name', {
										name:
											childrenName ||
											childrenCountKey ||
											String(node.id ?? index).split('/')[0],
									})
								"
								tooltip-position="right"
								class="--p-5:md-inv"
								link-button
								round
								@click="() => createNodeChildrenAndRefresh(nodes[index])"
							>
								<IconFa name="plus" />
							</ActionButtonLink>
						</div>
					</th>
					<td :colspan="propertiesMeta.length + 1" class="--pY-5 --index-1 --pRight">
						<div class="--width-100 --pRight --boxSizing --overflow-hidden">
							<hr :class="`--tm-${themeValues[0]}`" />
						</div>
					</td>
				</tr>
			</template>
		</template>
	</tbody>
</template>

<script setup lang="ts" generic="T extends Record<string, any>, TM extends Record<string, any> = T">
	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionLink from "../action/Link.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonLink from "../action/ButtonLink.vue";
	import InputToggle from "../input/Toggle.vue";
	import ValueComplex from "../value/Complex.vue";
	import Dropdown from "../dropdown/Simple.vue";
	import BaseBox from "../base/Box.vue";

	import type { iTableChildProps } from "../../types/props";
	import useTheme from "../../composables/theme";
	import { useHelpers } from "../../composables/utils";

	export interface iTableBodyProps<
		Ti extends Record<string, any>,
		TMi extends Record<string, any> = Ti,
	> extends iTableChildProps<Ti, TMi> {}

	/**
	 * Table body
	 *
	 * @component
	 */

	defineOptions({ name: "TableBody", inheritAttrs: false });

	const props = defineProps<iTableBodyProps<T, TM>>();

	const { t } = useHelpers(useI18n);
	const { themeValues, dangerThemeValues } = useTheme(props);
</script>
