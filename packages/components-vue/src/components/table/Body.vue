<template>
	<tbody v-if="nodes.length" :class="classes">
		<template v-for="(node, nodeIndex) in nodes" :key="nodeIndex">
			<!-- Row -->
			<tr
				class="--txtAlign"
				:class="[`--txtSize-${size}`, { ['is--selected']: selectedNodes[nodeIndex][0] }]"
			>
				<th
					v-if="nodes.length > 1 || $slots.default"
					class="--sticky"
					:class="{ ['is--selected']: !!ordering['id'] }"
					data-column-name="id"
					data-column="id"
				>
					<component
						:is="preferId"
						v-if="preferId && preferId !== true"
						:index="nodeIndex"
						:node="node"
					/>
					<div v-else class="flx --flxRow --flx-start-center --gap-10">
						<InputToggle
							v-if="!isReadOnly"
							:id="tableId + String(node.id ?? nodeIndex)"
							v-model="selectedNodes[nodeIndex][0]"
							:theme="theme || themeValues"
							:title="t('table_select')"
							:size="size"
						/>
						<span :title="String(node.id ?? nodeIndex)">
							{{ node.id && preferId ? node.id : nodeIndex + 1 }}
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
										updateNode: (n: any) => meta.updateNode?.(n, node),
									}),
								},
								node,
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
								node,
								updateNodeAndRefresh,
								cloneNodeAndRefresh,
								deleteNodeAndRefresh,
								deleteNodesAndRefresh,
								show: visibility[nodeIndex].show,
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
							@click="() => updateNodeAndRefresh(node)"
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
											@click="() => cloneNodeAndRefresh(node, setModel)"
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
														node,
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
											node,
											updateNodeAndRefresh,
											cloneNodeAndRefresh,
											deleteNodeAndRefresh,
											deleteNodesAndRefresh,
											show: visibility[nodeIndex].show,
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
							v-show="visibility[nodeIndex].show"
							:theme="theme || themeValues"
							transparent
							button
							solid
						>
							<slot
								v-bind="{
									node,
									updateNodeAndRefresh,
									cloneNodeAndRefresh,
									deleteNodeAndRefresh,
									deleteNodesAndRefresh,
									createNodeChildrenAndRefresh,
									show: visibility[nodeIndex].show,
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
								:active="visibility[nodeIndex].show"
								:tooltip="
									t(
										visibility[nodeIndex].show
											? 'table_hide_name'
											: 'table_see_name',
										{
											name:
												childrenName ||
												childrenCountKey ||
												String(node.id ?? nodeIndex).split('/')[0],
										}
									)
								"
								tooltip-position="right"
								:disabled="
									!visibility[nodeIndex].childrenCount ||
									visibility[nodeIndex].showNodeChildren
								"
								class="--p-5"
								@click="() => toggleChildren(nodeIndex)"
							>
								<span v-if="visibility[nodeIndex].childrenCount >= 1">
									{{ visibility[nodeIndex].childrenCount }}
								</span>
								<IconFa name="chevron-down" indicator />
							</ActionLink>
							<ActionButtonLink
								v-if="createNodeChildren"
								:theme="theme || themeValues"
								:size="size"
								:disabled="visibility[nodeIndex].disableCreateNodeChildren"
								:tooltip="
									t('table_create_new_name', {
										name:
											childrenName ||
											childrenCountKey ||
											String(node.id ?? nodeIndex).split('/')[0],
									})
								"
								tooltip-position="right"
								class="--p-5:md-inv"
								link-button
								round
								@click="() => createNodeChildrenAndRefresh(node)"
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
	import { computed } from "vue";

	import { useI18n, useSwal } from "@open-xamu-co/ui-common-helpers";

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
	import { useHelpers, useResolveNodeFn } from "../../composables/utils";
	import type { iNodeFn } from "@open-xamu-co/ui-common-types";

	export interface iTableBodyProps<
		Ti extends Record<string, any>,
		TMi extends Record<string, any> = Ti,
	> extends iTableChildProps<Ti, TMi> {}

	interface INodeVisibility {
		disableCreateNodeChildren?: boolean;
		showNodeChildren?: boolean;
		childrenCount: number;
		show: boolean;
	}

	/**
	 * Table body
	 *
	 * @component
	 */

	defineOptions({ name: "TableBody", inheritAttrs: false });

	const props = defineProps<iTableBodyProps<T, TM>>();

	const Swal = useHelpers(useSwal);
	const { t } = useHelpers(useI18n);
	const { themeValues, dangerThemeValues } = useTheme(props);

	/**
	 * Cached node visibility
	 */
	const visibility = computed(() => {
		return props.nodes.reduce(
			(acc, node, nodeIndex) => {
				const disableCreateNodeChildren = props.disableCreateNodeChildren?.(node);
				const showNodeChildren = props.showNodeChildren?.(node);
				const childrenCount = props.childrenCount(node);
				const shouldShow = props.selectedNodes[nodeIndex][1] && !!childrenCount;

				acc[nodeIndex] = {
					disableCreateNodeChildren,
					showNodeChildren,
					childrenCount,
					show: showNodeChildren ?? shouldShow,
				};

				return acc;
			},
			{} as Record<number, INodeVisibility>
		);
	});

	function hydrateNode(newNode: T | null, _newErrors?: unknown) {
		if (!props.hydrateNodes || !newNode) return;

		// Replace the node with the updated one
		const nodeIndex = props.nodes.findIndex(({ id }) => id === newNode.id);
		const existingNode = props.nodes[nodeIndex];
		const updatedNodes = props.nodes.toSpliced(nodeIndex, 1, { ...existingNode, ...newNode });

		props.hydrateNodes(updatedNodes);
	}

	/**
	 * Creates children for given node
	 * sometimes it could fail but still update (api issue)
	 *
	 * @single
	 */
	const createNodeChildrenAndRefresh: iNodeFn<T> = async (node: T) => {
		// display loader
		Swal.fireLoader();

		// run process
		const response = await useResolveNodeFn(props.createNodeChildren?.(node));
		const [updatedParent, event, closeModal] = response;

		// unfinished task
		if (typeof updatedParent === "undefined" || updatedParent === null) {
			if (Swal.isLoading()) Swal.close();
		} else if (updatedParent) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_created"),
				text: t("swal.table_created_text"),
				willOpen() {
					// If has children, prefer hydration over refreshing
					if (
						props.childrenCount(node) &&
						props.hydrateNodes &&
						typeof updatedParent === "object"
					) {
						hydrateNode({ ...node, ...updatedParent });
					} else if (!props.omitRefresh) props.refresh?.();

					closeModal?.();
				},
			});
		} else {
			// Error, children possibly not created
			Swal.fire({
				icon: "warning",
				title: t("swal.table_possibly_not_created"),
				text: t("swal.table_possibly_not_created_text"),
				target: event,
			});
		}

		return response;
	};
</script>
