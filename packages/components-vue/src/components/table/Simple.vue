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
			<TableHead v-bind="childrenProps" :with-default-slot="!!$slots.default">
				<template v-if="$slots.headActions" #headActions="headScope">
					<slot name="headActions" v-bind="headScope"></slot>
				</template>
			</TableHead>
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
	import { computed, getCurrentInstance, ref, watch } from "vue";
	import upperFirst from "lodash-es/upperFirst";
	import snakeCase from "lodash-es/snakeCase";
	import startCase from "lodash-es/startCase";
	import { Md5 } from "ts-md5";

	import type { iNodeFnResponse, tOrder } from "@open-xamu-co/ui-common-types";
	import { eSizes } from "@open-xamu-co/ui-common-enums";
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
	import TableHead from "./Head.vue";

	import useTheme from "../../composables/theme";
	import { useHelpers, useOrderBy } from "../../composables/utils";
	import type { iTableChildProps, iTablePropertyMeta, iTableProps } from "../../types/props";

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
	const { themeClasses, themeValues } = useTheme(props);
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

	const childrenProps = computed<iTableChildProps<T>>(() => ({
		...props,
		tableId: tableId.value,
		propertiesMeta: propertiesMeta.value,
		isReadOnly: isReadOnly.value,
		ordering: ordering.value,
		selectedNodes: selectedNodes.value,
		selectedNodesCount: selectedNodesCount.value,
		openNodesCount: openNodesCount.value,
		childrenCount,
		setOrdering,
		toggleAll,
		toggleChildren,
		updateNodeAndRefresh,
		cloneNodeAndRefresh,
		deleteNodeAndRefresh,
		deleteNodesAndRefresh,
	}));

	function reFillNodes(length: number): [boolean, boolean][] {
		return Array.from({ length }, () => [false, !!props.childrenVisibility]);
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
	async function cloneNodeAndRefresh(node: T, toggleModal?: (m?: boolean) => any) {
		// close modal
		toggleModal?.(false);
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
		toggleModal?: (m?: boolean) => any,
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
		toggleModal?.(false);
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

		// run process
		const deleted = await Promise.all(
			nodes.map(async (node) => await resolveNodeFn(props.deleteNode?.(node)))
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
