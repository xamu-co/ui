<template>
	<BaseErrorBoundary at="PaginationContentTable">
		<slot
			v-bind="{
				refreshData,
				hasContent: emittedHasContent,
				hydrateData: emittedHydrateNodes,
				createNodeAndRefresh,
			}"
		></slot>
		<!-- Temporary head actions -->
		<div
			v-if="!emittedHasContent && $slots.headActions"
			key="external-head-actions"
			class="flx --flxRow --flx-start-center --gap-10 --gap:md"
		>
			<slot
				name="headActions"
				v-bind="{
					refreshData,
					hasContent: emittedHasContent,
					hydrateData: emittedHydrateNodes,
					createNodeAndRefresh,
				}"
			></slot>
		</div>
		<PaginationContent
			v-bind="{
				page,
				url,
				noContentMessage,
				preventAutoload,
				theme,
				client,
				cache,
				defaults,
			}"
			pagination-class="flx --flxRow-wrap --flx-end-center --gap-5 --gap-10:sm --gap:md"
			class="flx --flxColumn --gap-10"
			hide-controls="single"
			:with-route="withRoute"
			@refresh="emittedRefresh = $event"
			@has-content="hasContent"
		>
			<template #default="{ content, currentPage, pagination }">
				<!-- Tabulated data -->
				<div class="flx --flxColumn --flx-start-stretch --gap-10">
					<BaseErrorBoundary
						at="PaginationContentTable:TableSimple"
						:theme="theme"
						:error-message="renderErrorMessage"
					>
						<TableSimple
							:nodes="content"
							:refresh="refreshData"
							:class="tableClass"
							v-bind="{
								theme,
								mapNodes,
								pageInfo: currentPage.pageInfo,
								hydrateNodes: emittedHydrateNodes,
								...tableProps,
								modalProps: {
									invertTheme: true,
									class: modalClass ?? tableClass,
									...tableProps?.modalProps,
								},
								withRoute: pagination,
							}"
						>
							<template
								v-if="emittedHasContent && $slots.headActions"
								#headActions="headActionsScope"
							>
								<div
									key="internal-head-actions"
									class="flx --flxRow --flx-start-center --gap-10 --gap:md"
								>
									<slot
										name="headActions"
										v-bind="{
											...headActionsScope,
											refreshData,
											hasContent: emittedHasContent,
											hydrateData: emittedHydrateNodes,
											createNodeAndRefresh,
										}"
									></slot>
								</div>
							</template>
							<template v-if="$slots.tableChildren" #default="tableChildrenScope">
								<slot
									name="tableChildren"
									v-bind="{
										...tableChildrenScope,
										refreshData,
										hasContent: emittedHasContent,
										hydrateData: emittedHydrateNodes,
										createNodeAndRefresh,
									}"
								></slot>
							</template>
							<template v-if="$slots.tableModifyActions" #modifyActions="modifyScope">
								<slot name="tableModifyActions" v-bind="modifyScope"></slot>
							</template>
							<template
								v-if="$slots.tableModifyDropdownActions"
								#modifyDropdownActions="modifyDropdownScope"
							>
								<slot
									name="tableModifyDropdownActions"
									v-bind="modifyDropdownScope"
								></slot>
							</template>
						</TableSimple>
					</BaseErrorBoundary>
				</div>
			</template>
			<template v-if="$slots.paginationActions" #paginationActions="paginationActionsSlots">
				<slot name="paginationActions" v-bind="paginationActionsSlots"></slot>
			</template>
		</PaginationContent>
	</BaseErrorBoundary>
</template>

<script setup lang="ts" generic="T extends Record<string, any>, TM extends Record<string, any> = T">
	import { ref, onActivated, onDeactivated } from "vue";

	import type { iNodeFn } from "@open-xamu-co/ui-common-types";
	import { useI18n, useSwal } from "@open-xamu-co/ui-common-helpers";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import TableSimple from "../table/Simple.vue";
	import PaginationContent from "./Content.vue";

	import type { iPaginationContentTableProps } from "../../types/props";
	import { useHelpers, useResolveNodeFn } from "../../composables/utils";

	/**
	 * Pagination Table
	 * Showcase a table with pagination and data fetching
	 *
	 * @component
	 */
	defineOptions({ name: "PaginationContentTable", inheritAttrs: false });

	const props = withDefaults(defineProps<iPaginationContentTableProps<T, TM>>(), {
		mapNode: (node: T) => node as unknown as TM,
		withRoute: true,
	});
	const emit = defineEmits<{ (e: "create-node-and-refresh", fn: iNodeFn<T, []>): void }>();

	const { t } = useHelpers(useI18n);
	const Swal = useHelpers(useSwal);

	const deactivated = ref<boolean>(false);
	const emittedRefresh = ref<() => void>();
	const emittedHasContent = ref<boolean>();
	const emittedContent = ref<T[] | null>();
	const emittedHydrateNodes = ref<(newContent: T[] | null, newErrors?: unknown) => void>();

	/**
	 * Handles content emission
	 */
	function hasContent(
		value: boolean,
		content?: T[] | null,
		hydrateNodes?: (newContent: T[] | null, newErrors?: unknown) => void
	) {
		const valueChanged = emittedHasContent.value !== value;
		const contentChanged = emittedContent.value !== content;

		emittedHasContent.value = value;
		emittedContent.value = content;
		emittedHydrateNodes.value = hydrateNodes;

		// Prevent emit if there are no changes
		if (valueChanged || contentChanged) {
			emit("create-node-and-refresh", createNodeAndRefresh);
		}
	}

	function refreshData() {
		props.refresh?.();
		emittedRefresh.value?.();
	}

	/**
	 * Map nodes to table nodes
	 * Allow tableProps.mapNodes to override mapNode
	 *
	 * @param nodes Array of nodes to map
	 * @returns Array of mapped nodes
	 */
	function mapNodes(nodes: T[] = []): (TM | undefined)[] {
		const tableMapNodes = props.tableProps?.mapNodes;

		return tableMapNodes ? tableMapNodes(nodes) : nodes.map(props.mapNode);
	}

	/**
	 * Creates given node
	 * sometimes it could fail but still create (api issue)
	 *
	 * @single
	 */
	const createNodeAndRefresh: iNodeFn<T, []> = async function () {
		// Display loader
		Swal.fireLoader();

		// Run process, get created node
		const [createdStream, event, closeModal] = await useResolveNodeFn(props.createNode?.());
		const [created, ...stream] = Array.isArray(createdStream) ? createdStream : [createdStream];
		let updatedNodes: T[] | undefined;

		// Unfinished task
		if (typeof created === "undefined" || created === null) {
			if (Swal.isLoading()) Swal.close();
		} else if (created) {
			Swal.fire({
				icon: "success",
				title: props.swal?.createdTitle || t("swal.table_created"),
				text: props.swal?.createdText || t("swal.table_created_text"),
				willOpen() {
					// Prepend single new element
					if (typeof created === "object" && created.id) {
						updatedNodes = [created, ...(emittedContent.value || [])];
					}

					// If has content, prefer hydration over refreshing
					// For some reason table doesn't always hydrate correctly (key issue?)
					// TODO: Address inconsistent content table hydration
					if (emittedHasContent.value && emittedHydrateNodes.value && updatedNodes) {
						emittedHydrateNodes.value(updatedNodes);
					} else if (!props.omitRefresh) refreshData();

					closeModal?.();
				},
			});
		} else {
			// Error, possibly not created
			Swal.fire({
				icon: "warning",
				title: props.swal?.notCreatedTitle || t("swal.table_possibly_not_created"),
				text: props.swal?.notCreatedText || t("swal.table_possibly_not_created_text"),
				target: event,
			});
		}

		// Hydration stream, do not await
		Promise.all(
			stream.map(async (next) => {
				const created = await next;

				// Bypass hydration
				if (!created || deactivated.value) return;

				// Update single element
				if (typeof created === "object" && created.id && updatedNodes) {
					// Replace the node with the updated one
					const nodeIndex = updatedNodes.findIndex((n) => n.id === created.id);

					updatedNodes = updatedNodes.toSpliced(nodeIndex, 1, {
						...updatedNodes[nodeIndex],
						...created,
					});

					// Hydrate if possible
					emittedHydrateNodes.value?.(updatedNodes);
				}
			})
		);

		return [created, event, closeModal];
	};

	// lifecycle
	onActivated(() => (deactivated.value = false));
	onDeactivated(() => (deactivated.value = true));
</script>
