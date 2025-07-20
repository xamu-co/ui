<template>
	<BaseErrorBoundary>
		<slot v-bind="{ hasContent, refreshData }"></slot>
		<div class="flx --flxColumn --gap-30">
			<div
				v-if="!hasContent && $slots.headActions"
				class="flx --flxRow --flx-start-center --gap-10 --gap:md"
			>
				<slot name="headActions" v-bind="{ hasContent, refreshData }"></slot>
			</div>
			<PaginationContent
				v-slot="{ content }"
				v-bind="{ page, url, noContentMessage, preventAutoload, theme, client, defaults }"
				pagination-class="flx --flxRow-wrap --flx-end-center --gap-5 --gap-10:sm --gap:md"
				class="flx --flxColumn --flx-start-stretch"
				with-route
				@refresh="emittedRefresh = $event"
				@has-content="hasContent = $event"
			>
				<Table
					:key="JSON.stringify({ url, defaults, length: content?.length })"
					:nodes="mapNodes(content)"
					:refresh="refreshData"
					:class="tableClass"
					v-bind="{
						theme,
						...tableProps,
						modalProps: {
							invertTheme: true,
							class: modalClass ?? tableClass,
							...tableProps?.modalProps,
						},
					}"
				>
					<template v-if="hasContent && $slots.headActions" #headActions>
						<div class="flx --flxRow --flx-start-center --gap-10 --gap:md">
							<slot name="headActions" v-bind="{ hasContent, refreshData }"></slot>
						</div>
					</template>
					<template v-if="$slots.tableChildren" #default="tableChildrenScope">
						<slot
							name="tableChildren"
							v-bind="{ ...tableChildrenScope, hasContent, refreshData }"
						></slot>
					</template>
				</Table>
			</PaginationContent>
		</div>
	</BaseErrorBoundary>
</template>

<script setup lang="ts" generic="T extends Record<string, any>, TM extends Record<string, any>">
	import { ref } from "vue";

	import type { iGetPage, tThemeModifier, tThemeTuple } from "@open-xamu-co/ui-common-types";
	import type { iTableProps } from "@open-xamu-co/ui-components-vue";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import Table from "../table/Simple.vue";
	import PaginationContent from "./Content.vue";

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
		mapNode?: (node: Ti) => TMi;
		preventAutoload?: boolean;
		/**
		 * Additional refresh function
		 */
		refresh?: () => void;
		noContentMessage?: string;
		tableProps?: Omit<iTableProps<TMi>, "nodes" | "refresh">;
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
	}

	/**
	 * Pagination Table
	 * Showcase a table with pagination and data fetching
	 *
	 * @component
	 */
	defineOptions({ name: "PaginationContentTable" });

	const props = withDefaults(defineProps<iPaginationContentTableProps<T, TM>>(), {
		mapNode: (node: T) => node as unknown as TM,
	});

	const hasContent = ref(true);
	const emittedRefresh = ref();

	function refreshData() {
		props.refresh?.();
		emittedRefresh.value?.();
	}

	function mapNodes(nodes: T[] = []): TM[] {
		return nodes.map(props.mapNode);
	}
</script>
