<template>
	<div v-if="nodes.length" class="flx --flxColumn --flx-start-stretch --width">
		<div v-if="!isReadOnly || $slots.default" class="flx --flxRow --flx-start-center">
			<ActionButtonLink
				v-if="$slots.default"
				:theme="theme"
				:active="openNodesCount === selectedNodes.length"
				@click="toggleAll(!(openNodesCount === selectedNodes.length), 1)"
			>
				<span>
					{{
						openNodesCount === selectedNodes.length
							? t("table_hide_all")
							: t("table_show_all")
					}}
				</span>
				<IconFa class="--indicator" name="chevron-up" />
			</ActionButtonLink>
			<div v-if="!isReadOnly" class="flx --flxRow --flx-end-center --flx">
				<ActionButton
					v-if="deleteNode"
					:tooltip="t('table_delete')"
					tooltip-as-text
					tooltip-position="bottom"
					:theme="[eColors.DANGER, themeValues[0]]"
					:disabled="!selectedNodes.some(([n]) => n)"
					@click="deleteNodesAndRefresh"
				>
					<span>
						{{
							selectedNodesCount === selectedNodes.length
								? t("delete_all")
								: t("delete", selectedNodesCount)
						}}
					</span>
					<IconFa name="trash-can" />
				</ActionButton>
			</div>
		</div>
		<div v-bind="$attrs" class="scroll --horizontal --always">
			<table :id="tableId" class="tbl" :class="themeClasses">
				<thead>
					<tr class="--txtAlign" :class="`--txtSize-${size}`">
						<!-- TODO: define filters, filter table contents -->
						<th
							class="--sticky"
							:class="{ ['is--selected']: canSort && isOrdering('id') }"
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
								<span v-if="isReadOnly || !canSort">#</span>
								<ActionLink
									v-else
									:theme="theme || themeValues"
									title="id"
									:tooltip="t('table_sort_by_name', { name: 'Id' })"
									tooltip-as-text
									tooltip-position="bottom"
									:size="size"
									@click="setOrdering('id')"
								>
									<span>#</span>
									<template v-if="isOrdering('id')">
										<IconFa v-if="ordering.asc" name="arrow-down" />
										<IconFa v-if="!ordering.asc" name="arrow-up" />
									</template>
								</ActionLink>
							</div>
						</th>
						<td
							v-for="(propertyName, propertyNameIndex) in propertiesMeta"
							:key="propertyNameIndex"
							class="--maxWidth-440"
							:class="[
								`--txtSize-${size}`,
								{ ['is--selected']: canSort && isOrdering(propertyName.value) },
							]"
							:data-column-name="propertyName.value"
							:data-column="propertyName.alias"
							:width="
								extraCols && propertyNameIndex === propertiesMeta.length - 1
									? '99%'
									: 'auto'
							"
						>
							<span v-if="!canSort" :title="String(propertyName.value)">
								{{ propertyName.alias }}
							</span>
							<ActionLink
								v-else
								:theme="theme || themeValues"
								:title="propertyName.value"
								:tooltip="t('table_sort_by_name', { name: propertyName.alias })"
								tooltip-as-text
								tooltip-position="bottom"
								:size="size"
								@click="setOrdering(propertyName.value)"
							>
								<span>{{ propertyName.alias }}</span>
								<template v-if="isOrdering(propertyName.value)">
									<IconFa v-if="ordering.asc" name="arrow-down" />
									<IconFa v-else name="arrow-up" />
								</template>
							</ActionLink>
						</td>
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
				<tbody :class="classes">
					<template v-for="(node, nodeIndex) in nodes" :key="nodeIndex">
						<tr
							class="--txtAlign"
							:class="[
								`--txtSize-${size}`,
								{ ['is--selected']: selectedNodes[nodeIndex][0] },
							]"
						>
							<th
								class="--sticky"
								:class="{ ['is--selected']: isOrdering('id') }"
								data-column-name="id"
								data-column="id"
							>
								<div class="flx --flxRow --flx-start-center --gap-10">
									<InputToggle
										v-if="!isReadOnly"
										:id="tableId + String(node.id ?? nodeIndex)"
										v-model="selectedNodes[nodeIndex][0]"
										:theme="theme || themeValues"
										:title="t('table_select')"
										:size="size"
									/>
									<span :title="String(node.id ?? nodeIndex)">
										{{
											node.id && typeof node.id === "number"
												? node.id
												: nodeIndex + 1
										}}
									</span>
								</div>
							</th>
							<td
								v-for="property in propertiesMeta"
								:key="property.value"
								:data-column-name="property.value"
								:data-column="property.alias"
								:class="[
									`--txtSize-${size}`,
									{ ['is--selected']: ordering.name === property.value },
								]"
								class="--maxWidth-440"
							>
								<ValueComplex
									v-bind="{
										value: node[property.value],
										property,
										node,
										readonly: isReadOnly,
										theme: theme || themeValues,
										modalProps: { theme: theme || themeValues, ...modalProps },
										classes,
										refresh,
										omitRefresh,
										size,
									}"
								/>
							</td>
							<th
								v-if="!isReadOnly && (!!updateNode || !!deleteNode || !!cloneNode)"
								class="--sticky --txtAlign-center"
								data-column-name="modify"
								:data-column="t('table_modify')"
							>
								<div class="flx --flxRow --flx-center --gap-10">
									<ActionButton
										v-if="!!updateNode"
										:tooltip="t('table_update')"
										tooltip-as-text
										tooltip-position="left"
										:theme="theme || themeValues"
										:size="size"
										round
										:disabled="selectedNodes.some(([n]) => n)"
										@click="updateNodeAndRefresh(node)"
									>
										<IconFa name="pencil" />
									</ActionButton>
									<Dropdown
										class="flx --flxRow --flx-center"
										:position="['left', 'center']"
										:theme="theme || themeValues"
										:size="size"
									>
										<template #toggle="{ setModel }">
											<ActionLink
												:aria-label="t('table_options')"
												:title="t('table_options')"
												:theme="theme || themeValues"
												:size="size"
												:disabled="selectedNodes.some(([n]) => n)"
												toggle="dropdown"
												@click="setModel()"
											>
												<IconFa name="ellipsis-vertical" />
											</ActionLink>
										</template>
										<template #default="{ setModel, invertedTheme }">
											<ul class="flx --flxColumn --flx-start-stretch --gap-5">
												<li v-if="!!cloneNode">
													<ActionLink
														:theme="invertedTheme"
														:size="size"
														:aria-label="t('table_duplicate')"
														@click="cloneNodeAndRefresh(node, setModel)"
													>
														<IconFa name="clone" />
														<span>
															{{ t("table_duplicate") }}
														</span>
													</ActionLink>
												</li>
												<li v-if="!!deleteNode">
													<ActionLink
														:theme="[eColors.DANGER, invertedTheme[0]]"
														:size="size"
														:aria-label="t('table_delete')"
														@click="
															deleteNodeAndRefresh(node, setModel)
														"
													>
														<IconFa name="trash-can" />
														<span>{{ t("table_delete") }}</span>
													</ActionLink>
												</li>
											</ul>
										</template>
									</Dropdown>
								</div>
							</th>
						</tr>
						<template v-if="$slots.default">
							<tr class="no--hover">
								<th class="--sticky --pX-10 --pY-5 --vAlign">
									<div class="flx --flxRow --flx-center-end --gap-10 --bdr">
										<ActionLink
											:theme="theme || themeValues"
											:size="size"
											:active="selectedNodes[nodeIndex][1]"
											:tooltip="
												t('table_see_name', {
													name:
														childrenName ||
														childrenCountKey ||
														String(node.id ?? nodeIndex).split('/')[0],
												})
											"
											tooltip-position="right"
											:disabled="childrenCountKey && !childrenCount(node)"
											class="--p-5"
											@click="toggleChildren(nodeIndex)"
										>
											<IconFa name="chevron-up" indicator />
										</ActionLink>
										<ActionButtonLink
											v-if="createNodeChildren"
											:theme="theme || themeValues"
											:size="size"
											:tooltip="t('table_create_new')"
											tooltip-position="right"
											class="--p-5:md-inv"
											link-button
											round
											@click="createNodeChildren(node)"
										>
											<IconFa name="plus" />
										</ActionButtonLink>
									</div>
								</th>
								<td
									:colspan="propertiesMeta.length + 1"
									class="--pY-5 --index-1 --pRight"
								>
									<div v-show="selectedNodes[nodeIndex][1]" class="--width">
										<slot
											v-bind="{ node, show: selectedNodes[nodeIndex][1] }"
										></slot>
									</div>
									<div
										v-if="!selectedNodes[nodeIndex][1]"
										class="--width --pRight --boxSizing --overflow-hidden"
									>
										<hr :class="`--tm-${themeValues[0]}`" />
									</div>
								</td>
							</tr>
						</template>
					</template>
				</tbody>
			</table>
		</div>
	</div>
	<BoxMessage v-else :theme="theme || themeValues">
		<div class="flx --flxRow --flx-center">
			<span>{{ t("nothing_to_show") }}</span>
			<ActionButtonToggle
				v-if="refresh"
				:theme="theme || themeValues"
				:tooltip="t('refresh')"
				round
				@click="refresh()"
			>
				<IconFa name="rotate-right" />
				<IconFa name="rotate-right" regular />
			</ActionButtonToggle>
		</div>
	</BoxMessage>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
	import { ref, computed, watch, getCurrentInstance, type AllowedComponentProps } from "vue";
	import _ from "lodash";

	import type {
		iNodeFn,
		iProperty,
		iSelectOption,
		tProps,
		tSizeModifier,
	} from "@open-xamu-co/ui-common-types";
	import { eColors, eSizes } from "@open-xamu-co/ui-common-enums";
	import { toOption, useSwal, useI18n } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "./icon/Fa.vue";
	import ActionLink from "./action/Link.vue";
	import ActionButton from "./action/Button.vue";
	import ActionButtonLink from "./action/ButtonLink.vue";
	import ActionButtonToggle from "./action/ButtonToggle.vue";
	import InputToggle from "./input/Toggle.vue";
	import ValueComplex from "./value/Complex.vue";
	import BoxMessage from "./box/Message.vue";
	import Dropdown from "./Dropdown.vue";

	import type { iModalProps, iUseThemeProps } from "../types/props";
	import useTheme from "../composables/theme";
	import { useHelpers } from "../composables/utils";
	import useUUID from "../composables/uuid";

	export interface iTableProps<Ti extends Record<string, any>> extends iUseThemeProps {
		/**
		 * Table nodes
		 * an array of nodes
		 *
		 * @old rows
		 */
		nodes: Ti[];
		/**
		 * Table column names
		 * an array of property names
		 *
		 * @old columns
		 */
		properties?: iProperty<Ti>[];
		/**
		 * read only table
		 * @old editable(inverse)
		 */
		readonly?: boolean;
		/**
		 * Do nodes support pagination?
		 */
		canSort?: boolean;
		/**
		 * Function used to update a node
		 */
		updateNode?: iNodeFn<Ti>;
		/**
		 * Function used to delete a node
		 */
		deleteNode?: iNodeFn<Ti>;
		/**
		 * Function used to duplicate a node
		 */
		cloneNode?: iNodeFn<Ti>;
		/**
		 * Function used to create a node children
		 *
		 * Useful to display the add button for the slot contents
		 */
		createNodeChildren?: iNodeFn<Ti>;
		/**
		 * Content clasess
		 */
		classes?: tProps<string>;
		/**
		 * Refresh the content
		 */
		refresh?: () => unknown;
		extraCols?: boolean;
		/**
		 * Default children visibility
		 */
		childrenVisibility?: boolean;
		childrenName?: string;
		childrenCountKey?: keyof Ti;
		modalProps?: iModalProps & AllowedComponentProps;
		/**
		 * Prevent node functions from triggering refresh event (useful with firebase hydration)
		 */
		omitRefresh?: boolean;
		size?: tSizeModifier;
	}

	/**
	 * Factory component for tables
	 * TODO: add drag to order functionality (It should require an order fn)
	 * TODO: support in place (cell) edition (update node property)
	 * TODO: support goTo property value (navigateTo)
	 *
	 * @component
	 */

	defineOptions({ name: "TableSimple", inheritAttrs: false });

	const props = withDefaults(defineProps<iTableProps<T>>(), {
		size: eSizes.SM,
	});

	const { t, tet } = useHelpers(useI18n);
	const Swal = useHelpers(useSwal);
	const { themeClasses, themeValues } = useTheme(props);
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;
	const { uuid } = useUUID();

	const randomId = uuid().replace("-", "").substring(0, 8);

	/** [selected, show] */
	const selectedNodes = ref<[boolean, boolean][]>(reFillNodes(props.nodes.length));
	const selectedNodesCount = computed(() => {
		return selectedNodes.value.filter(([selected]) => selected).length;
	});
	const openNodesCount = computed(() => {
		return selectedNodes.value.filter(([, open]) => open).length;
	});
	/**
	 * ordering property
	 *
	 * TODO: order using props or model instead (external pagination)
	 */
	const ordering = computed(() => {
		const orderBy = { name: "id", asc: true };

		if (router) {
			const route = router.currentRoute.value;

			if (!route.query.orderBy) return orderBy;

			const properties = String(route.query.orderBy).split(",");
			const property = properties[0]?.split(":");

			orderBy.name = property[0];

			if (String(property[1]).toUpperCase() === "DESC") orderBy.asc = false;
		}

		return orderBy;
	});
	const isReadOnly = computed<boolean>(() => {
		return (
			props.readonly ||
			!props.nodes.length ||
			(!props.updateNode && !props.cloneNode && !props.deleteNode)
		);
	});
	/**
	 * This one assumes all objects within nodes are all the same
	 */
	const propertiesMeta = computed<iSelectOption[]>(() => {
		return Object.entries(props.nodes[0])
			.sort(([a], [b]) => {
				// updatedAt, updatedBy, createdAt and createdBy to last position
				if (a.endsWith("At") || a.endsWith("By") || b.endsWith("At") || b.endsWith("By")) {
					if (a.endsWith("At") || a.endsWith("By")) return 1;

					return -1;
				} else if (a > b) return 1;
				else if (a < b) return -1;

				return 0;
			})
			.map(([key]) => {
				const options = (props.properties || []).map(toOption);
				const property = toOption(options.find((p) => p.value === key) || key);
				const aliasKey = _.snakeCase(key);

				return {
					...property,
					alias: _.capitalize(_.startCase(property.alias || tet(aliasKey))),
				};
			})
			.filter((property) => property.value !== "id");
	});
	/** Prefer a predictable identifier */
	const tableId = computed(() => {
		const childrenBased = props.childrenName || props.childrenCountKey;
		const metaBased = propertiesMeta.value[0].alias || propertiesMeta.value[0].value;
		const seed = _.deburr(String(childrenBased || metaBased || ""));

		return `table_${seed.replaceAll(" ", "") || randomId}`;
	});

	function reFillNodes(length: number): [boolean, boolean][] {
		return Array.from({ length }, () => [false, !!props.childrenVisibility]);
	}
	function childrenCount(node: T) {
		return props.childrenCountKey ? node[props.childrenCountKey] : 0;
	}
	function toggleAll(value = true, index = 0) {
		selectedNodes.value.forEach((_, i) => (selectedNodes.value[i][index] = value));
	}
	function toggleChildren(index: number) {
		const [selected, children] = selectedNodes.value[index];

		selectedNodes.value[index] = [selected, !children];
	}

	/**
	 * property is ordering the table
	 */
	function isOrdering(property: string | number): boolean {
		return ordering.value.name === property;
	}

	/**
	 * set pagination order
	 *
	 * @replace
	 */
	function setOrdering(property: string | number) {
		var order = "ASC";

		if (ordering.value.name === property && ordering.value.asc) {
			// switch order
			order = "DESC";
		}

		const orderBy = `${property}:${order}`;

		if (!router) return;

		const route = router.currentRoute.value;

		router.push({ path: route.path, hash: route.hash, query: { ...route.query, orderBy } });
	}

	/**
	 * Updates given node
	 * sometimes it could fail but still update (api issue)
	 *
	 * @single
	 *
	 * TODO: Support batch editing
	 */
	async function updateNodeAndRefresh(node: T) {
		// display loader
		Swal.fireLoader();

		// run process
		const updated = await props.updateNode?.(node);

		// unfinished task
		if (updated === undefined) {
			if (Swal.isLoading()) Swal.close();

			return;
		}

		if (updated) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_updated"),
			});
		} else {
			Swal.fire({
				icon: "warning",
				title: t("swal.table_updated"),
				text: t("swal.table_possibly_not_updated"),
			});
		}

		if (!props.omitRefresh) props.refresh?.();
	}

	/**
	 * Clones given node
	 * sometimes it could fail but still clone (api issue)
	 *
	 * @single
	 */
	async function cloneNodeAndRefresh(node: T, setModel: (m?: boolean) => boolean) {
		// close modal
		setModel(false);
		// display loader
		Swal.fireLoader();

		// run process
		const cloned = await props.cloneNode?.(node);

		// unfinished task
		if (cloned === undefined) {
			if (Swal.isLoading()) Swal.close();

			return;
		}

		if (cloned) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_cloned"),
			});
		} else {
			Swal.fire({
				icon: "warning",
				title: t("swal.table_cloned"),
				text: t("swal.table_possibly_not_cloned"),
			});
		}

		// update no matter what
		if (!props.omitRefresh) props.refresh?.();
	}

	/**
	 * Deletes given node
	 * sometimes it could fail but still delete (api issue)
	 *
	 * @single
	 */
	async function deleteNodeAndRefresh(node: T, setModel: (m?: boolean) => boolean) {
		// request confirmation
		const { value } = await Swal.firePrevent({
			title: t("table_delete"),
			text: t("swal.table_delete_node_title"),
			footer: t("swal.table_delete_node_disclaimer"),
		});

		if (!value) return;

		// close dropdown/modal
		setModel(false);
		// display loader
		Swal.fireLoader();

		// run process
		const deleted = await props.deleteNode?.(node);

		// unfinished task
		if (deleted === undefined) {
			if (Swal.isLoading()) Swal.close();

			return;
		}

		if (deleted) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_deleted"),
			});
		} else {
			Swal.fire({
				icon: "warning",
				title: t("swal.table_deleted"),
				text: t("swal.table_possibly_not_deleted"),
			});
		}

		// update no matter what
		if (!props.omitRefresh) props.refresh?.();
	}

	/**
	 * Deletes multiple selected nodes
	 * sometimes it could fail but still delete (api issue)
	 *
	 * @batch
	 */
	async function deleteNodesAndRefresh() {
		// request confirmation
		const { value } = await Swal.firePrevent({
			title: t("table_delete"),
			text: t("swal.table_delete_nodes_title", selectedNodesCount.value),
			footer: t("swal.table_delete_nodes_disclaimer"),
		});

		if (!value) return;

		// display loader
		Swal.fireLoader();

		// run process
		const deleted = await Promise.all(
			props.nodes
				.filter((_, nodeIndex) => selectedNodes.value[nodeIndex][0])
				.map(async (node) => await props.deleteNode?.(node))
		);

		// unfinished task
		if (deleted.every((d) => d === undefined)) {
			if (Swal.isLoading()) Swal.close();

			return;
		}

		if (deleted.every((d) => d)) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_deleted"),
			});
		} else {
			Swal.fire({
				icon: "warning",
				title: t("swal.table_deleted"),
				text: t("swal.table_possibly_not_deleted", props.nodes.length),
			});
		}
		// update no matter what
		if (!props.omitRefresh) props.refresh?.();
	}

	// lifecycle
	watch(
		() => props.nodes,
		(newNodes) => (selectedNodes.value = reFillNodes(newNodes.length)),
		{ immediate: false }
	);
</script>
