<template>
	<BaseErrorBoundary
		v-if="propertiesMeta.length || $slots.headActions"
		at="TableHeadActions"
		:theme="theme"
	>
		<!-- Bulk actions -->
		<TableHeadActions
			v-bind="childrenProps"
			:theme="opaque ? invertedThemeValues : theme"
			:with-default-slot="!!$slots.default"
		>
			<template v-if="$slots.headActions" #headActions="headScope">
				<slot name="headActions" v-bind="headScope"></slot>
			</template>
		</TableHeadActions>
	</BaseErrorBoundary>
	<BaseWrapper
		v-if="propertiesMeta.length"
		class="--gap-none --p-10 --maxWidth-100"
		:wrap="!!opaque"
		:wrapper="BaseBox"
		:theme="invertedThemeValues"
		:size="eSizes.SM"
		style="z-index: 1"
		opaque
		button
		solid
	>
		<div
			:class="[{ 'scroll --horizontal --always': !nested }, $attrs.class]"
			style="z-index: 1"
		>
			<table
				:id="`${tableId}_content`"
				class="tbl --minWidth-100 table-content"
				:class="[{ '--nested': nested }, themeClasses]"
			>
				<BaseErrorBoundary at="TableHeadContent" :theme="theme">
					<!-- Head content, column names -->
					<TableHeadContent
						v-bind="childrenProps"
						:with-default-slot="!!$slots.default"
					/>
				</BaseErrorBoundary>
				<BaseErrorBoundary at="TableBody" :theme="theme">
					<!-- Body, rows -->
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
				</BaseErrorBoundary>
			</table>
		</div>
	</BaseWrapper>
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
	import { computed, getCurrentInstance, onActivated, onDeactivated, ref, watch } from "vue";
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
	import BaseErrorBoundary from "../base/ErrorBoundary.vue";

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
		// Leave nodes as they are
		mapNodes: (nodes: T[]) => nodes as unknown as TM[],
	});
	const emit = defineEmits(["update:sort"]);

	const { t, tet } = useHelpers(useI18n);
	const Swal = useHelpers(useSwal);
	const { themeClasses, themeValues, invertedThemeValues } = useTheme(props);
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;

	const deactivated = ref(false);

	/**
	 * Mapped nodes
	 * Keeps the original node and the mapped node if any (filtered)
	 */
	const mappedNodes = computed<iMappedNodes<T, TM>>(() => {
		const newNodes: iMappedNodes<T, TM> = { nodes: [], length: 0, withChildren: false };

		props.nodes.forEach((node, index) => {
			const [mappedNode] = props.mapNodes([node]);

			// Filter out invalid nodes
			if (!mappedNode || !Object.keys(mappedNode).length) return;

			const disableCreateNodeChildren = props.disableCreateNodeChildren?.(node);
			const showNodeChildren = props.showNodeChildren?.(node);
			const visibility: iNodeVisibility = {
				disableCreateNodeChildren,
				showNodeChildren,
				childrenCount: childrenCount(node, mappedNode),
			};

			if (visibility.childrenCount) newNodes.withChildren = true;

			/** Hydrate this node only */
			const hydrateNode = makeHydrateNode(index);
			/** Add children and hydrate this node only */
			const createNodeChildrenAndRefresh = makeCreateNodeChildrenAndRefresh(
				index,
				visibility
			);

			newNodes.nodes.push({
				node: mappedNode,
				index,
				visibility,
				hydrateNode,
				createNodeChildrenAndRefresh,
			});
			newNodes.length++;
		});

		return newNodes;
	});

	const selectedNodes = ref<boolean[]>([]);
	const openNodes = ref<boolean[]>([]);

	const selectedNodesCount = computed(() => {
		return selectedNodes.value.filter((selected) => selected).length;
	});
	const openNodesCount = computed(() => {
		return openNodes.value.filter((open) => open).length;
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
			!mappedNodes.value.nodes.length ||
			(!props.updateNode && !props.cloneNode && !props.deleteNode)
		);
	});

	/**
	 * Properties meta
	 *
	 * Get meta from mapped nodes
	 * This one assumes all objects within nodes are all the same
	 */
	const propertiesMeta = computed<iTablePropertyMeta<T>[]>(() => {
		if (!mappedNodes.value.nodes.length) return [];

		const mappedNode: TM = mappedNodes.value.nodes[0].node;
		const sorted = Object.entries(mappedNode).sort(props.propertyOrder || useOrderProperty);
		const properties: iTablePropertyMeta<T>[] = [];

		for (const [key, value] of sorted) {
			// Get meta defaults
			const options = (props.properties || []).map(toOption);
			const property = toOption(options.find((p) => p.value === key) || key);
			const aliasKey = snakeCase(key);

			const meta: iTablePropertyMeta<T> = {
				...property, // Set defaults
				value: String(property.value),
				alias: upperFirst(startCase(property.alias || tet(aliasKey))),
				canSort: !!props.sort && isPlainValue(value),
			};

			// Conditionally add meta
			if (!["id", props.childrenCountKey].includes(meta.value)) properties.push(meta);
		}

		return properties;
	});
	/** Prefer a predictable identifier */
	const tableId = computed(() => {
		const childrenBased = props.childrenName || String(props.childrenCountKey);

		if (!propertiesMeta.value.length) return Md5.hashStr(`table-${childrenBased}`);

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
		openNodes: openNodes.value,
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

		return showNodeChildren ?? (selectedNodes.value[mappedIndex] && !!childrenCount);
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
	function childrenCount(node: T, mappedNode: TM): number {
		if (props.childrenCountKey) {
			const key: any = props.childrenCountKey;
			const countValue = mappedNode[key] || node[key] || 0;

			if (Array.isArray(countValue)) return countValue.length;

			return countValue;
		}

		return 0;
	}
	function toggleAll(value = true, index = 0) {
		if (index === 0) {
			// Select all nodes
			selectedNodes.value = Array.from(
				{ length: mappedNodes.value.nodes.length },
				() => value
			);
		} else {
			// Open all nodes
			openNodes.value = Array.from({ length: mappedNodes.value.nodes.length }, () => value);
		}
	}
	function toggleChildren(index: number) {
		const selected = selectedNodes.value[index];

		selectedNodes.value[index] = !selected;
	}

	function makeHydrateNode(nodeIndex: number) {
		return (newNode: T | null, _newErrors?: unknown) => {
			if (!newNode) return;

			// Replace the node with the updated one
			const existingNode = props.nodes[nodeIndex];

			if (nodeIndex > -1) {
				const updatedNodes = props.nodes.toSpliced(nodeIndex, 1, {
					...existingNode,
					...newNode,
				});

				// Hydrate node, fallback to refresh
				if (props.hydrateNodes) props.hydrateNodes(updatedNodes);
				else if (!props.omitRefresh) props.refresh?.();
			}
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
		// Display loader
		Swal.fireLoader();

		// Run process, get updated node
		const [updatedStream, event, closeModal] = await useResolveNodeFn(props.updateNode?.(node));
		const [updated, ...stream] = Array.isArray(updatedStream) ? updatedStream : [updatedStream];

		// Unfinished task
		if (typeof updated === "undefined" || updated === null) {
			if (Swal.isLoading()) Swal.close();
		} else if (updated) {
			Swal.fire({
				icon: "success",
				title: props.swal?.updatedTitle || t("swal.table_updated"),
				text: props.swal?.updatedText || t("swal.table_updated_text"),
				willOpen() {
					// Update single element, prefer hydration over refreshing
					if (typeof updated === "object" && updated.id) {
						const nodeIndex = props.nodes.findIndex((n) => n.id === updated.id);
						const hydrateNode = makeHydrateNode(nodeIndex);

						// Hydrate if possible
						hydrateNode(updated);
					} else if (!props.omitRefresh) props.refresh?.();

					closeModal?.();
				},
			});
		} else {
			// Error, possibly not updated
			Swal.fire({
				icon: "warning",
				title: props.swal?.notUpdatedTitle || t("swal.table_possibly_not_updated"),
				text: props.swal?.notUpdatedText || t("swal.table_possibly_not_updated_text"),
				target: event,
			});
		}

		// Hydration stream, do not await
		Promise.all(
			stream.map(async (next) => {
				const updated = await next;

				// Bypass hydration
				if (!updated || deactivated.value) return;

				// Update single element, hydration only
				if (typeof updated === "object" && updated.id) {
					const nodeIndex = props.nodes.findIndex((n) => n.id === updated.id);
					const hydrateNode = makeHydrateNode(nodeIndex);

					// Hydrate if possible
					hydrateNode(updated);
				}
			})
		);

		return [updated, event, closeModal];
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

		// Run process, get cloned node
		const [clonedStream, event, closeModal] = await useResolveNodeFn(
			props.cloneNode?.(clearNode)
		);
		const [cloned, ...stream] = Array.isArray(clonedStream) ? clonedStream : [clonedStream];

		// unfinished task
		if (typeof cloned === "undefined" || cloned === null) {
			if (Swal.isLoading()) Swal.close();
		} else if (cloned) {
			Swal.fire({
				icon: "success",
				title: props.swal?.clonedTitle || t("swal.table_cloned"),
				text: props.swal?.clonedText || t("swal.table_cloned_text"),
				willOpen() {
					let updatedNodes: T[] | undefined;

					// Add single new element
					if (typeof cloned === "object" && cloned.id) {
						const nodeIndex = props.nodes.findIndex((n) => n.id === cloned.id);

						if (nodeIndex > -1) {
							// Add cloned node after the original node
							updatedNodes = props.nodes.toSpliced(nodeIndex + 1, 0, {
								...clearNode, // Prevent mixing non clonable values
								...cloned,
							});
						}
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
				title: props.swal?.notClonedTitle || t("swal.table_possibly_not_cloned"),
				text: props.swal?.notClonedText || t("swal.table_possibly_not_cloned_text"),
				target: event,
			});
		}

		// Hydration stream, do not await
		Promise.all(
			stream.map(async (next) => {
				const cloned = await next;

				// Bypass hydration
				if (!cloned || deactivated.value) return;

				// Update single element, hydration only
				if (typeof cloned === "object" && cloned.id) {
					const nodeIndex = props.nodes.findIndex((n) => n.id === cloned.id);
					const hydrateNode = makeHydrateNode(nodeIndex);

					// Hydrate if possible
					hydrateNode(cloned);
				}
			})
		);

		return [cloned, event, closeModal];
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
		const [deletedStream, event, closeModal] = await useResolveNodeFn(props.deleteNode?.(node));
		const [deleted, ...stream] = Array.isArray(deletedStream) ? deletedStream : [deletedStream];

		// unfinished task
		if (typeof deleted === "undefined" || deleted === null) {
			if (Swal.isLoading()) Swal.close();
		} else if (deleted) {
			Swal.fire({
				icon: "success",
				title: props.swal?.deletedTitle || t("swal.table_deleted"),
				text: props.swal?.deletedText || t("swal.table_deleted_text"),
				willOpen() {
					let updatedNodes: T[] | undefined;

					// Delete single node
					const nodeIndex = props.nodes.findIndex((n) => n.id === node.id);

					if (nodeIndex > -1) updatedNodes = props.nodes.toSpliced(nodeIndex, 1);

					// Prefer hydration over refreshing, (Avoid delayed deletion issues)
					if (props.hydrateNodes && updatedNodes) props.hydrateNodes(updatedNodes);
					else if (!props.omitRefresh) props.refresh?.();

					closeModal?.();
				},
			});
		} else {
			// Error, possibly not deleted
			Swal.fire({
				icon: "warning",
				title: props.swal?.notDeletedTitle || t("swal.table_possibly_not_deleted"),
				text: props.swal?.notDeletedText || t("swal.table_possibly_not_deleted_text"),
				target: event,
			});
		}

		// Hydration stream, do not await
		Promise.all(
			stream.map(async (next) => {
				const deleted = await next;

				// Bypass hydration
				if (!deleted || deactivated.value) return;

				// Assume removed, prefer refreshing over hydration
				if (props.refresh && !props.omitRefresh) {
					props.refresh();
				} else if (props.hydrateNodes) {
					// Remove the node
					const nodeIndex = props.nodes.findIndex((n) => n.id === node.id);

					if (nodeIndex > -1) {
						const updatedNodes: T[] = props.nodes.toSpliced(nodeIndex, 1);

						// Hydrate if possible
						props.hydrateNodes?.(updatedNodes);
					}
				}
			})
		);

		return [deleted, event, closeModal];
	};

	/**
	 * Deletes multiple selected nodes
	 * sometimes it could fail but still delete (api issue)
	 *
	 * @batch
	 */
	async function deleteNodesAndRefresh(
		nodes = props.nodes.filter((_, nodeIndex) => selectedNodes.value[nodeIndex])
	) {
		// Request confirmation
		const { value } = await Swal.firePrevent({
			title: t("table_delete"),
			text: t("swal.table_delete_nodes_title", selectedNodesCount.value),
			footer: t("swal.table_delete_nodes_disclaimer"),
		});

		if (!value) return;

		// Display loader
		Swal.fireLoader();

		const updatedNodes: T[] = [...props.nodes];
		const streams: Promise<boolean | T>[] = [];
		// Run processes in parallel, get deletion responses
		const deleted: iNodeFnResponse<T>[] = await Promise.all(
			nodes.map(async (node) => {
				const [deletedNodeStream, ...response] = await useResolveNodeFn(
					props.deleteNode?.(node)
				);
				const [deletedNode, ...stream] = Array.isArray(deletedNodeStream)
					? deletedNodeStream
					: [deletedNodeStream];

				// Add streams
				streams.push(...stream);

				// Remove deleted node
				const nodeIndex = updatedNodes.findIndex(({ id }) => id === node.id);

				// Remove single node
				if (nodeIndex > -1) updatedNodes.splice(nodeIndex, 1);

				return [deletedNode, ...response];
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
					// Prefer hydration over refreshing, (Avoid soft delete issues)
					if (props.hydrateNodes) props.hydrateNodes(updatedNodes);
					else if (!props.omitRefresh) props.refresh?.();

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

		// Hydration stream, do not await
		Promise.all(streams).then((all) => {
			const allDeleted = all.every((d) => d);

			// Bypass hydration
			if (!allDeleted || deactivated.value) return;

			// Already removed, prefer refreshing over hydration
			if (!props.omitRefresh) props.refresh?.();
		});
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
		/** Hydrate parent node */
		const hydrateNode = makeHydrateNode(nodeIndex);

		return async (node: T) => {
			// display loader
			Swal.fireLoader();

			// run process that creates children, get updated parent
			const [updatedStream, event, closeModal] = await useResolveNodeFn(
				props.createNodeChildren?.(node)
			);
			const [updated] = Array.isArray(updatedStream) ? updatedStream : [updatedStream];

			// unfinished task
			if (typeof updated === "undefined" || updated === null) {
				if (Swal.isLoading()) Swal.close();
			} else if (updated) {
				Swal.fire({
					icon: "success",
					title: props.swal?.createdChildrenTitle || t("swal.table_created"),
					text: props.swal?.createdChildrenText || t("swal.table_created_text"),
					willOpen() {
						// Update single parent element
						if (typeof updated === "object" && updated.id) {
							// Increase parent counter
							if (props.childrenCountKey) {
								const key = props.childrenCountKey as keyof T;

								// Increase counter
								if (updated[key] === node[key]) updated[key]++;
							}

							// Hydrate if possible
							if (visibility.childrenCount) hydrateNode(updated);
						} else if (!props.omitRefresh) props.refresh?.();

						closeModal?.();
					},
				});
			} else {
				// Error, children possibly not created
				Swal.fire({
					icon: "warning",
					title:
						props.swal?.notCreatedChildrenTitle || t("swal.table_possibly_not_created"),
					text:
						props.swal?.notCreatedChildrenText ||
						t("swal.table_possibly_not_created_text"),
					target: event,
				});
			}

			return [updated, event, closeModal];
		};
	}

	// lifecycle
	watch(
		[mappedNodes, () => props.withRoute && router?.currentRoute.value.fullPath],
		([newNodes, newRoute], [oldNodes, oldRoute]) => {
			// Omit for hydration
			if (
				!oldNodes?.nodes?.length ||
				oldNodes.nodes.length !== newNodes.nodes.length ||
				oldRoute !== newRoute
			) {
				selectedNodes.value = Array.from({ length: newNodes.nodes.length }, () => false);
				openNodes.value = Array.from(
					{ length: newNodes.nodes.length },
					() => !!props.childrenVisibility
				);
			}
		},
		{ immediate: true }
	);
	onActivated(() => (deactivated.value = false));
	onDeactivated(() => (deactivated.value = true));
</script>
