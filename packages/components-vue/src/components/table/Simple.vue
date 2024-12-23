<template>
	<div
		v-if="nodes.length || $slots.headActions"
		:class="[{ 'scroll --horizontal --always': !nested }, $attrs.class]"
	>
		<table
			:id="tableId"
			class="tbl --minWidth-100"
			:class="[{ '--nested': nested }, themeClasses]"
		>
			<thead>
				<tr v-if="!isReadOnly || $slots.default || $slots.headActions" class="no--hover">
					<td :colspan="propertiesMeta.length + 2">
						<!-- Sticky scrolling fix  -->
						<table :id="`bulk_${tableId}`" class="tbl tbl-helper" :class="themeClasses">
							<tbody>
								<tr class="no--hover">
									<th
										v-if="$slots.default || $slots.headActions"
										class="--sticky --pBottom-10"
									>
										<div
											class="flx --flxRow --flx-start-center --gap-10 --gap:md --flx"
										>
											<ActionButtonLink
												v-if="$slots.default && nodes.length"
												:theme="theme"
												:active="openNodesCount === selectedNodes.length"
												round=":sm-inv"
												@click="
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
											<slot name="headActions"></slot>
										</div>
									</th>
									<td
										class="--pBottom-10"
										:colspan="propertiesMeta.length"
										width="99%"
									></td>
									<th
										v-if="!isReadOnly && nodes.length"
										class="--sticky --pBottom-10"
										colspan="0"
										width="1px"
									>
										<div
											class="flx --flxRow --flx-end-center --gap-10 --gap:md --flx"
										>
											<ActionButton
												v-if="deleteNode"
												:tooltip="t('table_delete')"
												tooltip-as-text
												tooltip-position="bottom"
												:theme="dangerThemeValues"
												:disabled="!selectedNodes.some(([n]) => n)"
												round=":sm-inv"
												@click="deleteNodesAndRefresh"
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
				<tr v-if="nodes.length" class="--txtAlign" :class="`--txtSize-${size}`">
					<!-- TODO: define filters, filter table contents -->
					<th
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
								@click="setOrdering('id')"
							>
								<span>#</span>
								<template v-if="!!ordering['id']">
									<IconFa v-if="ordering['id'] === 'asc'" name="arrow-down" />
									<IconFa v-else name="arrow-up" />
								</template>
							</ActionLink>
						</div>
					</th>
					<td
						v-for="(meta, metaIndex) in propertiesMeta"
						:key="metaIndex"
						class="--maxWidth-440"
						:class="[
							`--txtSize-${size}`,
							{ ['is--selected']: meta.canSort && !!ordering[meta.value] },
						]"
						:data-column-name="meta.value"
						:data-column="meta.alias"
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
							@click="setOrdering(meta.value)"
						>
							<span>{{ meta.alias }}</span>
							<template v-if="!!ordering[meta.value]">
								<IconFa v-if="ordering[meta.value] === 'asc'" name="arrow-down" />
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
			<tbody v-if="nodes.length" :class="classes">
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
							:class="{ ['is--selected']: !!ordering['id'] }"
							data-column-name="id"
							data-column="id"
						>
							<component
								:is="preferId"
								v-if="preferId && typeof preferId !== 'boolean'"
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
							<component
								:is="property.component || ValueComplex"
								v-bind="{
									value: node[property.value],
									property: {
										...property,
										...(property.updateNode && {
											updateNode: (n: any) => property.updateNode?.(n, node),
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
											@click="setModel()"
										>
											<IconFa name="ellipsis-vertical" />
										</ActionLink>
									</template>
									<template
										#default="{ setModel, invertedTheme, model, dropdownRef }"
									>
										<ul
											v-if="model"
											class="flx --flxColumn --flx-start-stretch --gap-10"
										>
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
													:theme="dangerThemeValues"
													:size="size"
													:aria-label="t('table_delete')"
													@click="
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
										</ul>
									</template>
								</Dropdown>
							</div>
						</th>
					</tr>
					<template v-if="$slots.default">
						<tr class="no--hover --width-100">
							<td :colspan="propertiesMeta.length + 2">
								<div
									v-show="selectedNodes[nodeIndex][1] && !!childrenCount(node)"
									class="box --button --bdr-solid --bgColor-none"
								>
									<slot
										v-bind="{
											node,
											show:
												selectedNodes[nodeIndex][1] &&
												!!childrenCount(node),
										}"
									></slot>
								</div>
							</td>
						</tr>
						<tr class="no--hover">
							<th class="--sticky --pX-10 --pY-5 --vAlign">
								<div class="flx --flxRow --flx-end-center --gap-10 --bdr">
									<ActionLink
										:theme="theme || themeValues"
										:size="size"
										:active="
											selectedNodes[nodeIndex][1] && !!childrenCount(node)
										"
										:tooltip="
											t('table_see_name', {
												name:
													childrenName ||
													childrenCountKey ||
													String(node.id ?? nodeIndex).split('/')[0],
											})
										"
										tooltip-position="right"
										:disabled="!childrenCount(node)"
										class="--p-5"
										@click="toggleChildren(nodeIndex)"
									>
										<span v-if="childrenCount(node) >= 1">
											{{ childrenCount(node) }}
										</span>
										<IconFa name="chevron-down" indicator />
									</ActionLink>
									<ActionButtonLink
										v-if="createNodeChildren"
										:theme="theme || themeValues"
										:size="size"
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
								<div class="--width-100 --pRight --boxSizing --overflow-hidden">
									<hr :class="`--tm-${themeValues[0]}`" />
								</div>
							</td>
						</tr>
					</template>
				</template>
			</tbody>
		</table>
	</div>
	<BoxMessage v-else :theme="theme || themeValues" class="--width-100">
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
	import upperFirst from "lodash-es/upperFirst";
	import snakeCase from "lodash-es/snakeCase";
	import startCase from "lodash-es/startCase";
	import { Md5 } from "ts-md5";

	import type {
		iNodeFn,
		iNodeFnResponse,
		iProperty,
		tOrder,
		tOrderBy,
		tPropertyOrderFn,
		tProps,
		tSizeModifier,
	} from "@open-xamu-co/ui-common-types";
	import { eSizes } from "@open-xamu-co/ui-common-enums";
	import {
		toOption,
		useSwal,
		useI18n,
		useOrderProperty,
		isPlainValue,
	} from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionLink from "../action/Link.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonLink from "../action/ButtonLink.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import InputToggle from "../input/Toggle.vue";
	import ValueComplex from "../value/Complex.vue";
	import BoxMessage from "../box/Message.vue";
	import Dropdown from "../dropdown/Simple.vue";

	import type { vComponent } from "../../types/plugin";
	import type { iModalProps, iUseThemeProps, iValueComplexProps } from "../../types/props";
	import useTheme from "../../composables/theme";
	import { useHelpers, useOrderBy } from "../../composables/utils";

	export interface iTablePropertyMeta<Ti extends Record<string, any>>
		extends iProperty<Record<string, any>, Ti, vComponent<iValueComplexProps>> {
		value: string;
		canSort: boolean;
	}

	export interface iTableIdComponentProps<Ti extends Record<string, any>> {
		index: number;
		node: Ti;
	}

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
		properties?: iProperty<any, NoInfer<Ti>, vComponent<iValueComplexProps>>[];
		propertyOrder?: tPropertyOrderFn;
		/**
		 * read only table
		 * @old editable(inverse)
		 */
		readonly?: boolean;
		/**
		 * Do nodes support pagination?
		 */
		sort?: boolean | tOrderBy;
		/**
		 * Function used to update a node
		 */
		updateNode?: iNodeFn<NoInfer<Ti>>;
		/**
		 * Function used to delete a node
		 */
		deleteNode?: iNodeFn<NoInfer<Ti>>;
		/**
		 * Function used to duplicate a node
		 */
		cloneNode?: iNodeFn<NoInfer<Ti>>;
		/**
		 * Function used to create a node children
		 *
		 * Useful to display the add button for the default slot contents
		 */
		createNodeChildren?: iNodeFn<NoInfer<Ti>>;
		/**
		 * Content clasess
		 */
		classes?: tProps<string>;
		/**
		 * Refresh the content
		 */
		refresh?: () => unknown;
		/**
		 * Table is nested within another
		 */
		nested?: boolean;
		/**
		 * Default children visibility
		 */
		childrenVisibility?: boolean;
		/**
		 * Human readable name
		 *
		 * @fallback property name
		 */
		childrenName?: string;
		childrenCountKey?: keyof NoInfer<Ti>;
		modalProps?: iModalProps & AllowedComponentProps;
		/**
		 * Prevent node functions from triggering refresh event (useful with firebase hydration)
		 */
		omitRefresh?: boolean;
		size?: tSizeModifier;
		withRoute?: boolean;
		/**
		 * Show real node id or given component
		 */
		preferId?: boolean | vComponent<iTableIdComponentProps<NoInfer<Ti>>>;
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
	const emit = defineEmits(["update:sort"]);

	const { t, tet } = useHelpers(useI18n);
	const Swal = useHelpers(useSwal);
	const { themeClasses, themeValues, dangerThemeValues } = useTheme(props);
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;

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
	 * TODO: require & use order getter fn instead
	 */
	const ordering = computed(() => {
		let [sortKey = "id", sortValue = "desc"] = Array.isArray(props.sort) ? props.sort : [];

		let orderBy: Record<string, tOrder> = { [sortKey]: sortValue };

		if (props.withRoute && router) {
			const route = router.currentRoute.value;

			const routeOrderBy = useOrderBy(route.query.orderBy);

			if (!routeOrderBy.length) return orderBy;

			orderBy = routeOrderBy.reduce<Record<string, tOrder>>((acc, [key, value]) => {
				acc[key] = value || "desc";

				return acc;
			}, {});
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
	const propertiesMeta = computed<iTablePropertyMeta<T>[]>(() => {
		return Object.entries(props.nodes[0])
			.sort(props.propertyOrder || useOrderProperty)
			.map(([key, value]) => {
				const options = (props.properties || []).map(toOption);
				const property = toOption(options.find((p) => p.value === key) || key);
				const aliasKey = snakeCase(key);

				return {
					...property,
					value: String(property.value),
					alias: upperFirst(startCase(property.alias || tet(aliasKey))),
					canSort: !!props.sort && isPlainValue(value),
				};
			})
			.filter(({ value }) => !["id", props.childrenCountKey].includes(value));
	});
	/** Prefer a predictable identifier */
	const tableId = computed(() => {
		const childrenBased = props.childrenName || String(props.childrenCountKey);
		const metaBased = propertiesMeta.value[0].alias || propertiesMeta.value[0].value;

		return Md5.hashStr(`table-${childrenBased}-${metaBased}`);
	});

	function reFillNodes(length: number): [boolean, boolean][] {
		return Array.from({ length }, () => [false, !!props.childrenVisibility]);
	}
	function childrenCount(node: T) {
		if (props.childrenCountKey) {
			const countValue = node[props.childrenCountKey];

			if (Array.isArray(countValue)) return countValue.length;

			return countValue;
		}

		return 0;
	}
	function toggleAll(value = true, index = 0) {
		selectedNodes.value.forEach((_, i) => (selectedNodes.value[i][index] = value));
	}
	function toggleChildren(index: number) {
		const [selected, children] = selectedNodes.value[index];

		selectedNodes.value[index] = [selected, !children];
	}

	/**
	 * set pagination order
	 *
	 * @replace
	 */
	function setOrdering(property: string) {
		let order: tOrder = "desc";

		if (ordering.value[property]) {
			// switch order
			order = ordering.value[property] === "desc" ? "asc" : "desc";
		}

		if (props.withRoute && router) {
			const route = router.currentRoute.value;
			const orderBy = `${property}:${order}`;

			router.push({ path: route.path, hash: route.hash, query: { ...route.query, orderBy } });
		} else emit("update:sort", [property, order]);
	}

	async function resolveNodeFn(
		promise:
			| boolean
			| undefined
			| iNodeFnResponse
			| Promise<boolean | undefined | iNodeFnResponse>
	): Promise<iNodeFnResponse> {
		const resolve = await promise;

		if (Array.isArray(resolve)) return resolve;

		return [resolve];
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
		const [updated, event, willOpen] = await resolveNodeFn(props.updateNode?.(node));

		// unfinished task
		if (typeof updated !== "boolean") {
			if (Swal.isLoading()) Swal.close();
		} else if (updated) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_updated"),
				willOpen,
				didDestroy() {
					if (!props.omitRefresh) props.refresh?.();
				},
			});
		} else {
			Swal.fire({
				icon: "warning",
				title: t("swal.table_updated"),
				text: t("swal.table_possibly_not_updated"),
				target: event,
			});
		}
	}

	/**
	 * Clones given node
	 * sometimes it could fail but still clone (api issue)
	 *
	 * @single
	 */
	async function cloneNodeAndRefresh(node: T, toggleModal: (m?: boolean) => any) {
		// close modal
		toggleModal(false);
		// display loader
		Swal.fireLoader();

		// run process
		const [cloned, event, willOpen] = await resolveNodeFn(props.cloneNode?.(node));

		// unfinished task
		if (typeof cloned !== "boolean") {
			if (Swal.isLoading()) Swal.close();
		} else if (cloned) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_cloned"),
				willOpen,
				didDestroy() {
					if (!props.omitRefresh) props.refresh?.();
				},
			});
		} else {
			Swal.fire({
				icon: "warning",
				title: t("swal.table_cloned"),
				text: t("swal.table_possibly_not_cloned"),
				target: event,
			});
		}
	}

	/**
	 * Deletes given node
	 * sometimes it could fail but still delete (api issue)
	 *
	 * @single
	 */
	async function deleteNodeAndRefresh(
		node: T,
		toggleModal: (m?: boolean) => any,
		modalRef?: HTMLElement
	) {
		// request confirmation
		const { value } = await Swal.firePrevent({
			title: t("table_delete"),
			text: t("swal.table_delete_node_title"),
			footer: t("swal.table_delete_node_disclaimer"),
			target: modalRef,
		});

		if (!value) return;

		// close dropdown/modal
		toggleModal(false);
		// display loader
		Swal.fireLoader();

		// run process
		const [deleted, event, willOpen] = await resolveNodeFn(props.deleteNode?.(node));

		// unfinished task
		if (typeof deleted !== "boolean") {
			if (Swal.isLoading()) Swal.close();
		} else if (deleted) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_deleted"),
				willOpen,
				didDestroy() {
					if (!props.omitRefresh) props.refresh?.();
				},
			});
		} else {
			Swal.fire({
				icon: "warning",
				title: t("swal.table_deleted"),
				text: t("swal.table_possibly_not_deleted"),
				target: event,
			});
		}
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
				.map(async (node) => await resolveNodeFn(props.deleteNode?.(node)))
		);
		const [, event, willOpen] = deleted[0];

		// unfinished task
		if (deleted.every(([d]) => d === undefined)) {
			if (Swal.isLoading()) Swal.close();
		} else if (deleted.every(([d]) => d)) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_deleted"),
				willOpen,
				didDestroy() {
					if (!props.omitRefresh) props.refresh?.();
				},
			});
		} else {
			Swal.fire({
				icon: "warning",
				title: t("swal.table_deleted"),
				text: t("swal.table_possibly_not_deleted", props.nodes.length),
				target: event,
			});
		}
	}

	// lifecycle
	watch(
		() => props.nodes,
		(newNodes) => (selectedNodes.value = reFillNodes(newNodes.length)),
		{ immediate: false }
	);
</script>
