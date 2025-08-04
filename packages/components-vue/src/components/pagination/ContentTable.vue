<template>
	<BaseErrorBoundary>
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
			v-slot="{ content }"
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
			class="flx --flxColumn --gap-30"
			with-route
			@refresh="emittedRefresh = $event"
			@has-content="hasContent"
		>
			<!-- Tabulated data -->
			<div class="flx --flxColumn --flx-start-stretch">
				<Table
					:key="JSON.stringify({ url, defaults, length: content?.length })"
					:nodes="content"
					:refresh="refreshData"
					:class="tableClass"
					v-bind="{
						theme,
						mapNodes,
						hydrateNodes: emittedHydrateNodes,
						...tableProps,
						modalProps: {
							invertTheme: true,
							class: modalClass ?? tableClass,
							...tableProps?.modalProps,
						},
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
				</Table>
			</div>
		</PaginationContent>
	</BaseErrorBoundary>
</template>

<script setup lang="ts" generic="T extends Record<string, any>, TM extends Record<string, any> = T">
	import { ref } from "vue";

	import type {
		iGetPage,
		iNodeFn,
		tThemeModifier,
		tThemeTuple,
	} from "@open-xamu-co/ui-common-types";
	import type { iTableProps } from "@open-xamu-co/ui-components-vue";
	import { useI18n, useSwal } from "@open-xamu-co/ui-common-helpers";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import Table from "../table/Simple.vue";
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
		/**
		 * Function used to create a node
		 */
		createNode?: iNodeFn<NoInfer<Ti>, []>;
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

	function mapNodes(nodes: T[] = []): TM[] {
		return nodes.map(props.mapNode);
	}

	/**
	 * Creates given node
	 * sometimes it could fail but still create (api issue)
	 *
	 * @single
	 */
	async function createNodeAndRefresh() {
		// display loader
		Swal.fireLoader();

		// run process
		const response = await useResolveNodeFn(props.createNode?.());
		const [created, event, closeModal] = response;

		// unfinished task
		if (typeof created === "undefined" || created === null) {
			if (Swal.isLoading()) Swal.close();
		} else if (created) {
			Swal.fire({
				icon: "success",
				title: t("swal.table_created"),
				text: t("swal.table_created_text"),
				willOpen() {
					let createdNodes: T[] | undefined;

					// Prepend single new element
					if (typeof created === "object" && created.id) {
						createdNodes = [created, ...(emittedContent.value || [])];
					}

					// If has content, prefer hydration over refreshing
					if (emittedHasContent.value && emittedHydrateNodes.value && createdNodes) {
						emittedHydrateNodes.value(createdNodes);
					} else if (!props.omitRefresh) refreshData();

					closeModal?.();
				},
			});
		} else {
			// Error, possibly not created
			Swal.fire({
				icon: "warning",
				title: t("swal.table_possibly_not_created"),
				text: t("swal.table_possibly_not_created_text"),
				target: event,
			});
		}

		return response;
	}
</script>
