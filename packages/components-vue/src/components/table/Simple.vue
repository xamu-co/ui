<template>
	<template v-if="nodes.length || $slots.headActions">
		<table
			:id="`${tableId}_actions`"
			class="tbl --minWidth-100 table-actions"
			:class="[{ '--nested': nested }, themeClasses]"
		>
			<TableHeadActions
				v-bind="childrenProps"
				:theme="opaque ? invertedThemeValues : theme"
				:with-default-slot="!!$slots.default"
			>
				<template v-if="$slots.headActions" #headActions="headScope">
					<slot name="headActions" v-bind="headScope"></slot>
				</template>
			</TableHeadActions>
		</table>
		<BaseWrapper
			class="--gap-none --p-10 --maxWidth-100"
			:wrap="!!opaque"
			:wrapper="BaseBox"
			:theme="invertedThemeValues"
			:size="eSizes.SM"
			solid
			opaque
		>
			<div :class="[{ 'scroll --horizontal --always': !nested }, $attrs.class]">
				<table
					:id="`${tableId}_content`"
					class="tbl --minWidth-100 table-content"
					:class="[{ '--nested': nested }, themeClasses]"
				>
					<TableHeadContent
						v-bind="childrenProps"
						:with-default-slot="!!$slots.default"
					/>
					<TableBody v-bind="childrenProps">
						<template v-if="$slots.default" #default="defaultScope">
							<slot name="default" v-bind="defaultScope"></slot>
						</template>
						<template v-if="$slots.modifyActions" #modifyActions="modifyScope">
							<slot name="modifyActions" v-bind="modifyScope"></slot>
						</template>
						<template
							v-if="$slots.modifyDropdownActions"
							#modifyDropdownActions="modifyDropdownScope"
						>
							<slot name="modifyDropdownActions" v-bind="modifyDropdownScope"></slot>
						</template>
					</TableBody>
				</table>
			</div>
		</BaseWrapper>
	</template>
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

<script setup lang="ts" generic="T extends Record<string, any>, TM extends Record<string, any> = T">
	import { computed, getCurrentInstance, ref, watch } from "vue";
	import upperFirst from "lodash-es/upperFirst";
	import snakeCase from "lodash-es/snakeCase";
	import startCase from "lodash-es/startCase";
	import { Md5 } from "ts-md5";

	import type { iNodeFn, iNodeFnResponse, tOrder } from "@open-xamu-co/ui-common-types";
	import { eColors, eSizes } from "@open-xamu-co/ui-common-enums";
	import {
		toOption,
		useI18n,
		useOrderProperty,
		isPlainValue,
		useSwal,
	} from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import BoxMessage from "../box/Message.vue";
	import TableBody from "./Body.vue";
	import TableHeadContent from "./HeadContent.vue";
	import TableHeadActions from "./HeadActions.vue";
	import BaseBox from "../base/Box.vue";
	import BaseWrapper from "../base/Wrapper.vue";

	import useTheme from "../../composables/theme";
	import { useHelpers, useOrderBy, useResolveNodeFn } from "../../composables/utils";
	import type {
		iTableChildProps,
		iTablePropertyMeta,
		iTableProps,
		iMappedNodes,
		iNodeVisibility,
	} from "../../types/props";

	/**
	 * Factory component for tables
	 * TODO: add drag to order functionality (It should require an order fn)
	 * TODO: support in place (cell) edition (update node property)
	 * TODO: support goTo property value (navigateTo)
	 *
	 * @component
	 */

	defineOptions({ name: "TableSimple", inheritAttrs: false });

	const props = withDefaults(defineProps<iTableProps<T, TM>>(), {
		size: eSizes.SM,
		theme: eColors.SECONDARY,
		mapNodes: (nodes: T[]) => nodes as unknown as TM[],
	});
	const emit = defineEmits(["update:sort"]);

	const { t, tet } = useHelpers(useI18n);
	const Swal = useHelpers(useSwal);
	const { themeClasses, themeValues, invertedThemeValues } = useTheme(props);
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;
	/**
	 * Mapped nodes
	 * Keeps the original node and the mapped node if any (filtered)
	 */
	const mappedNodes = computed(() => {
		const nodes: iMappedNodes<T, TM> = { nodes: [], length: 0, withChildren: false };

		props.nodes.forEach((node, index) => {
			const [mappedNode] = props.mapNodes([node]);

			if (!mappedNode) return;

			const disableCreateNodeChildren = props.disableCreateNodeChildren?.(node);
			const showNodeChildren = props.showNodeChildren?.(node);

			const visibility: iNodeVisibility = {
				disableCreateNodeChildren,
				showNodeChildren,
				childrenCount: childrenCount(node),
			};

			if (visibility.childrenCount) nodes.withChildren = true;

			const hydrateNode = makeHydrateNode(index);
			const createNodeChildrenAndRefresh = makeCreateNodeChildrenAndRefresh(
				index,
				visibility
			);

			nodes.nodes.push({
				node: mappedNode,
				index,
				visibility,
				hydrateNode,
				createNodeChildrenAndRefresh,
			});
			nodes.length++;
		});

		return nodes;
	});

	/** [selected, show] */
	const selectedNodes = ref<[boolean, boolean][]>([]);

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
			!mappedNodes.value.length ||
			(!props.updateNode && !props.cloneNode && !props.deleteNode)
		);
	});

	/**
	 * This one assumes all objects within nodes are all the same
	 */
	const propertiesMeta = computed<iTablePropertyMeta<T>[]>(() => {
		const [mappedNode] = props.mapNodes([props.nodes[0]]);
		const sorted = Object.entries(mappedNode).sort(props.propertyOrder || useOrderProperty);
		const properties: iTablePropertyMeta<T>[] = [];

		for (const [key, value] of sorted) {
			const options = (props.properties || []).map(toOption);
			const property = toOption(options.find((p) => p.value === key) || key);
			const aliasKey = snakeCase(key);

			const meta: iTablePropertyMeta<T> = {
				...property,
				value: String(property.value),
				alias: upperFirst(startCase(property.alias || tet(aliasKey))),
				canSort: !!props.sort && isPlainValue(value),
			};

			if (!["id", props.childrenCountKey].includes(meta.value)) {
				properties.push(meta);
			}
		}

		return properties;
	});
	/** Prefer a predictable identifier */
	const tableId = computed(() => {
		const childrenBased = props.childrenName || String(props.childrenCountKey);
		const metaBased = propertiesMeta.value[0].alias || propertiesMeta.value[0].value;

		return Md5.hashStr(`table-${childrenBased}-${metaBased}`);
	});

	const childrenProps = computed<iTableChildProps<T, TM>>(() => ({
		...props,
		mappedNodes: mappedNodes.value,
		tableId: tableId.value,
		propertiesMeta: propertiesMeta.value,
		isReadOnly: isReadOnly.value,
		ordering: ordering.value,
		selectedNodes: selectedNodes.value,
		selectedNodesCount: selectedNodesCount.value,
		openNodesCount: openNodesCount.value,
		canShowChildren,
		setOrdering,
		toggleAll,
		toggleChildren,
		updateNodeAndRefresh,
		cloneNodeAndRefresh,
		deleteNodeAndRefresh,
		deleteNodesAndRefresh,
	}));

	function canShowChildren(visibility: iNodeVisibility, mappedIndex: number): boolean {
		const { showNodeChildren, childrenCount } = visibility;

		return showNodeChildren ?? (selectedNodes.value[mappedIndex][1] && !!childrenCount);
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

	/** Count childrens */
	function childrenCount(node: T): number {
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

	function makeHydrateNode(nodeIndex: number) {
		return (newNode: T | null, _newErrors?: unknown) => {
			if (!props.hydrateNodes || !newNode) return;

			// Replace the node with the updated one
			const existingNode = props.nodes[nodeIndex];
			const updatedNodes = props.nodes.toSpliced(nodeIndex, 1, {
				...existingNode,
				...newNode,
			});

			props.hydrateNodes(updatedNodes);
		};
	}

	/**
	 * Updates given node
	 * sometimes it could fail but still update (api issue)
	 *
	 * @single
	 *
	 * TODO: Support batch editing
	 */
	const updateNodeAndRefresh: iNodeFn<T> = async (node: T) => {
		// display loader
		Swal.fireLoader();

		// run process
		const response = await useResolveNodeFn(props.updateNode?.(node));
		const [updated, event, closeModal] = response;

		// unfinished task
		if (typeof updated === "undefined" || updated === null) {
			if (Swal.isLoading()) Swal.close();
		} else if (updated) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_updated"),
				text: t("swal.table_updated_text"),
				willOpen() {
					let updatedNodes: T[] | undefined;

					// Update single element
					if (typeof updated === "object" && updated.id) {
						const nodeIndex = props.nodes.findIndex((n) => n.id === node.id);

						// Replace the node with the updated one
						updatedNodes = props.nodes.toSpliced(nodeIndex, 1, {
							...node,
							...updated,
						});
					}

					// Prefer hydration over refreshing
					if (props.hydrateNodes && updatedNodes) props.hydrateNodes(updatedNodes);
					else if (!props.omitRefresh) props.refresh?.();

					closeModal?.();
				},
			});
		} else {
			// Error, possibly not updated
			Swal.fire({
				icon: "warning",
				title: t("swal.table_possibly_not_updated"),
				text: t("swal.table_possibly_not_updated_text"),
				target: event,
			});
		}

		return response;
	};

	/**
	 * Clones given node
	 * sometimes it could fail but still clone (api issue)
	 *
	 * @single
	 */
	const cloneNodeAndRefresh: iNodeFn<T, [T, ((m?: boolean) => any) | undefined]> = async (
		node: T,
		toggleModal?: (m?: boolean) => any
	) => {
		// close modal
		toggleModal?.(false);
		// display loader
		Swal.fireLoader();

		// Remove properties that should not be cloned
		const clearNode = { ...node };

		for (const property of propertiesMeta.value) {
			if (property.cloneNode === false) delete clearNode[property.value];
		}

		// run process
		const response = await useResolveNodeFn(props.cloneNode?.(clearNode));
		const [cloned, event, closeModal] = response;

		// unfinished task
		if (typeof cloned === "undefined" || cloned === null) {
			if (Swal.isLoading()) Swal.close();
		} else if (cloned) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_cloned"),
				text: t("swal.table_cloned_text"),
				willOpen() {
					let updatedNodes: T[] | undefined;

					// Add single new element
					if (typeof cloned === "object" && cloned.id) {
						const nodeIndex = props.nodes.findIndex((n) => n.id === node.id);

						// Add cloned node after the original node
						updatedNodes = props.nodes.toSpliced(nodeIndex + 1, 0, {
							...node,
							...cloned,
						});
					}

					// Prefer hydration over refreshing
					if (props.hydrateNodes && updatedNodes) props.hydrateNodes(updatedNodes);
					else if (!props.omitRefresh) props.refresh?.();

					closeModal?.();
				},
			});
		} else {
			// Error, possibly not cloned
			Swal.fire({
				icon: "warning",
				title: t("swal.table_possibly_not_cloned"),
				text: t("swal.table_possibly_not_cloned_text"),
				target: event,
			});
		}

		return response;
	};

	/**
	 * Deletes given node
	 * sometimes it could fail but still delete (api issue)
	 *
	 * @single
	 */
	const deleteNodeAndRefresh: iNodeFn<
		T,
		[T, ((m?: boolean) => any) | undefined, HTMLElement?]
	> = async (node: T, toggleModal?: (m?: boolean) => any, modalRef?: HTMLElement) => {
		// request confirmation
		const { value } = await Swal.firePrevent({
			title: t("table_delete"),
			text: t("swal.table_delete_node_title"),
			footer: t("swal.table_delete_node_disclaimer"),
			target: modalRef,
		});

		if (!value) return;

		// close dropdown/modal
		toggleModal?.(false);
		// display loader
		Swal.fireLoader();

		// run process
		const response = await useResolveNodeFn(props.deleteNode?.(node));
		const [deleted, event, closeModal] = response;

		// unfinished task
		if (typeof deleted === "undefined" || deleted === null) {
			if (Swal.isLoading()) Swal.close();
		} else if (deleted) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_deleted"),
				text: t("swal.table_deleted_text"),
				willOpen() {
					// Prefer refreshing over hydration
					if (props.refresh) {
						if (!props.omitRefresh) props.refresh?.();
					} else if (props.hydrateNodes) {
						const nodeIndex = props.nodes.findIndex((n) => n.id === node.id);
						// Remove the node
						const updatedNodes: T[] = props.nodes.toSpliced(nodeIndex, 1);

						props.hydrateNodes(updatedNodes);
					}

					closeModal?.();
				},
			});
		} else {
			// Error, possibly not deleted
			Swal.fire({
				icon: "warning",
				title: t("swal.table_possibly_not_deleted"),
				text: t("swal.table_possibly_not_deleted_text"),
				target: event,
			});
		}

		return response;
	};

	/**
	 * Deletes multiple selected nodes
	 * sometimes it could fail but still delete (api issue)
	 *
	 * @batch
	 */
	async function deleteNodesAndRefresh(
		nodes = props.nodes.filter((_, nodeIndex) => selectedNodes.value[nodeIndex][0])
	) {
		// request confirmation
		const { value } = await Swal.firePrevent({
			title: t("table_delete"),
			text: t("swal.table_delete_nodes_title", selectedNodesCount.value),
			footer: t("swal.table_delete_nodes_disclaimer"),
		});

		if (!value) return;

		// display loader
		Swal.fireLoader();

		let updatedNodes: T[] = [...props.nodes];
		// run process in parallel
		const deleted: iNodeFnResponse<T>[] = await Promise.all(
			nodes.map(async (node) => {
				const response = await useResolveNodeFn(props.deleteNode?.(node));
				const [deletedNode] = response;

				// Remove deleted node
				if (typeof deletedNode === "object") {
					const nodeIndex = updatedNodes.findIndex(({ id }) => id === node.id);

					// Remove single node
					if (nodeIndex > -1) updatedNodes.splice(nodeIndex, 1);
				}

				return response;
			})
		);
		const [, event, closeModal] = deleted[0];

		// unfinished task
		if (deleted.every(([d]) => d === undefined || d === null)) {
			if (Swal.isLoading()) Swal.close();
		} else if (deleted.every(([d]) => d)) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_deleted"),
				text: t("swal.table_deleted_text"),
				willOpen() {
					// Prefer refreshing over hydration
					if (props.refresh) {
						if (!props.omitRefresh) props.refresh?.();
					} else if (props.hydrateNodes) props.hydrateNodes(updatedNodes);

					closeModal?.();
				},
			});
		} else {
			// Error, possibly not deleted
			Swal.fire({
				icon: "warning",
				title: t("swal.table_possibly_not_deleted"),
				text: t("swal.table_possibly_not_deleted_text", props.nodes.length),
				target: event,
			});
		}
	}

	/**
	 * Creates children for given node
	 * sometimes it could fail but still update (api issue)
	 *
	 * @single
	 */
	function makeCreateNodeChildrenAndRefresh(
		nodeIndex: number,
		visibility: iNodeVisibility
	): iNodeFn<T> {
		return async (node: T) => {
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
						const hydrateNode = makeHydrateNode(nodeIndex);

						// If has children, prefer hydration over refreshing
						if (
							visibility.childrenCount &&
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
	}

	// lifecycle
	watch(
		[mappedNodes, () => props.withRoute && router?.currentRoute.value.fullPath],
		([newNodes, newRoute], [oldNodes, oldRoute]) => {
			const reFillNodes: [boolean, boolean][] = Array.from(
				{ length: newNodes.length },
				() => [false, !!props.childrenVisibility]
			);

			// Omit for hydration
			if (!oldNodes || oldNodes?.length !== newNodes.length || oldRoute !== newRoute) {
				selectedNodes.value = reFillNodes;
			}
		},
		{ immediate: true }
	);
</script>
