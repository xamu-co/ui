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
			v-slot="{ content, currentPage, pagination }"
			v-bind="{
				page,
				url,
				noContentMessage,
				preventAutoload,
				theme,
				client,
				defaults,
			}"
			pagination-class="flx --flxRow-wrap --flx-end-center --gap-5 --gap-10:sm --gap:md"
			class="flx --flxColumn --gap-10"
			hide-controls="single"
			with-route
			@refresh="emittedRefresh = $event"
			@has-content="hasContent"
		>
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
					</TableSimple>
				</BaseErrorBoundary>
			</div>
		</PaginationContent>
	</BaseErrorBoundary>
</template>

<script setup lang="ts" generic="T extends Record<string, any>, TM extends Record<string, any> = T">
	import { ref, onActivated, onDeactivated } from "vue";

	import type {
		iGetPage,
		iNodeFn,
		iNodeStreamFn,
		tThemeModifier,
		tThemeTuple,
	} from "@open-xamu-co/ui-common-types";
	import type { iTableProps } from "@open-xamu-co/ui-components-vue";
	import { useI18n, useSwal } from "@open-xamu-co/ui-common-helpers";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import TableSimple from "../table/Simple.vue";
	import PaginationContent from "./Content.vue";

	import { useHelpers, useResolveNodeFn } from "../../composables/utils";

	export interface iPaginationContentTableProps<
		Ti extends Record<string, any>,
		TMi extends Record<string, any>,
	> {
		/**
		 * Required to dedupe caching
		 */
		url: string;
		page: iGetPage<Ti>;
		defaults?: Record<string, any>;
		/** Map node data as required */
		mapNode?: (node: Ti) => TMi;
		preventAutoload?: boolean;
		/**
		 * Additional refresh function
		 */
		refresh?: () => void;
		noContentMessage?: string;
		renderErrorMessage?: string;
		tableProps?: Omit<iTableProps<Ti, TMi>, "nodes" | "refresh">;
		theme?: tThemeModifier | tThemeTuple;
		client?: boolean;
		/**
		 * Additional class for the table
		 *
		 * @example --txtColor
		 */
		tableClass?: string | string[] | Record<string, boolean>;
		/**
		 * Additional class for the modal
		 *
		 * @example --txtColor
		 */
		modalClass?: string | string[] | Record<string, boolean>;
		/** Function used to create a node */
		createNode?: iNodeStreamFn<NoInfer<Ti>, []>;
		swal?: {
			// Create node swal texts
			createdTitle?: string;
			createdText?: string;
			notCreatedTitle?: string;
			notCreatedText?: string;
		};
		/**
		 * Prevent node functions from triggering refresh event (useful with firebase hydration)
		 */
		omitRefresh?: boolean;
	}

	/**
	 * Pagination Table
	 * Showcase a table with pagination and data fetching
	 *
	 * @component
	 */
	defineOptions({ name: "PaginationContentTable", inheritAttrs: false });

	const props = withDefaults(defineProps<iPaginationContentTableProps<T, TM>>(), {
		mapNode: (node: T) => node as unknown as TM,
	});
	const emit = defineEmits(["create-node-and-refresh"]);

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
		emittedHasContent.value = value;
		emittedContent.value = content;
		emittedHydrateNodes.value = hydrateNodes;
		emit("create-node-and-refresh", createNodeAndRefresh);
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
	const createNodeAndRefresh: iNodeFn<T> = async function () {
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
