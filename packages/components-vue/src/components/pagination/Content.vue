<template>
	<LoaderContentFetch
		v-slot="{ content, refresh }"
		:hydratable-promise="patchedHydratablePromise"
		:payload="[{ ...pagination, ...defaults }]"
		:class="$attrs.class"
		v-bind="{
			preventAutoload,
			theme,
			noContentMessage,
			label,
			isContent,
			url,
			ignoreErrors,
			client,
		}"
		@refresh="$emit('refresh', $event)"
		@has-content="hasContent"
	>
		<slot
			v-bind="{
				hydrateNodes,
				content: processContent(content.edges.map(({ node }) => node)),
				pagination,
				currentPage: content,
				refresh,
			}"
		></slot>
		<PaginationSimple
			v-if="showControls(content.totalCount, pagination.first)"
			v-model="pagination"
			v-bind="{ currentPage: content, withRoute, theme }"
			:class="paginationClass"
		/>
	</LoaderContentFetch>
</template>

<script setup lang="ts" generic="T, C extends string | number = string, R = never">
	import { computed, getCurrentInstance, inject, ref, type Ref } from "vue";

	import type {
		iGetPage,
		iPage,
		iPageEdge,
		iPagination,
		iPluginOptions,
	} from "@open-xamu-co/ui-common-types";

	import LoaderContentFetch from "../loader/ContentFetch.vue";
	import PaginationSimple from "./Simple.vue";

	import type { iUseThemeProps } from "../../types/props";
	import { useOrderBy } from "../../composables/utils";

	export interface iPCProps<Ti, Ci extends string | number = string, Ri = never>
		extends iPagination, iUseThemeProps {
		/**
		 * Function used to fetch the page
		 */
		page?: Ri extends iGetPage<Ti, Ci>
			? iGetPage<Ti, Ci>
			: (params?: iPagination) => Promise<Ri | undefined>;
		/**
		 * Function used to fetch the page and hydrate the content
		 */
		hydratablePage?: (
			content: Ref<iPage<Ti, Ci> | null | undefined>,
			errors: Ref<unknown>
		) => Ri extends iGetPage<Ti, Ci>
			? iGetPage<Ti, Ci>
			: (params?: iPagination) => Promise<Ri | undefined>;
		/**
		 * Path used as key for the cache
		 */
		url?: string;
		/**
		 * paginate using route
		 *
		 * @example "?orderBy=id:asc" single order property
		 * @example "?orderBy=id:asc&orderBy=createdAt" multiple order properties
		 */
		withRoute?: boolean;
		/**
		 * hide pagination buttons
		 *
		 * @example true hide pagination buttons
		 * @example "single" hide pagination buttons if only one page
		 */
		hideControls?: boolean | "single";
		preventAutoload?: boolean;
		/**
		 * Additional parameters to send every request
		 */
		defaults?: Record<string, any>;
		noContentMessage?: string;
		/**
		 * Loader label
		 */
		label?: string;
		/**
		 * When additional operations are required on fetched data
		 *
		 * Raw promise payload
		 */
		transform?: (r: Ri) => iPage<Ti, Ci> | undefined;
		/**
		 * When additional operations are required on content
		 *
		 * Nodes arr only
		 */
		processContent?: (n: NoInfer<Ti>[]) => NoInfer<Ti>[];
		/**
		 * Ignore errors and display existing content.
		 */
		ignoreErrors?: boolean;
		/**
		 * Whether to fetch data on client side only
		 */
		client?: boolean;
		/**
		 * Additional class for the pagination
		 *
		 * @example --txtColor
		 */
		paginationClass?: string | string[] | Record<string, boolean>;
	}

	/**
	 * Menu de paginacion
	 * Redirecciona a la misma ruta + el query de pagina
	 *
	 * @component
	 * @example
	 * <PaginationContent></PaginationContent>
	 */

	defineOptions({ name: "PaginationContent", inheritAttrs: false });

	const props = withDefaults(defineProps<iPCProps<T, C, R>>(), {
		processContent: (c: T[]) => c,
	});
	const emit = defineEmits(["refresh", "has-content"]);

	const { first: defaultFirst, cursorEncoder } = inject<iPluginOptions>("xamu") || {};
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;

	const propsPagination = ref<iPagination>({
		orderBy: props.orderBy,
		first: props.first ?? defaultFirst,
		at: props.at,
	});
	const hydrateNodes = ref<(newContent: T[] | null, newErrors?: unknown) => void>();

	const pagination = computed<iPagination>({
		get() {
			if (props.withRoute && router) {
				const { orderBy, first, at } = propsPagination.value;
				const route = router.currentRoute.value;
				const routeFirst = route.query.first;
				const routeAt = route.query.at;
				const routeOrderBy = useOrderBy(route.query.orderBy);

				return {
					orderBy: routeOrderBy.length ? routeOrderBy : orderBy,
					first: Number(routeFirst ?? first),
					at: routeAt ?? at,
				};
			}

			return propsPagination.value;
		},
		set(newPagination) {
			if (props.withRoute && router) {
				const route = router.currentRoute.value;

				router.push({
					path: route.path,
					hash: route.hash,
					query: { ...route.query, ...newPagination },
				});
			}

			propsPagination.value = newPagination;
		},
	});

	/**
	 * Patched promise, with optional hydration
	 *
	 * @param content Content ref
	 * @param errors Errors ref
	 */
	const patchedHydratablePromise = (
		content: Ref<iPage<T, C> | null | undefined>,
		errors: Ref<unknown>
	): iGetPage<T, C> => {
		const page = props.hydratablePage?.(content, errors) || props.page;

		return async (v) => {
			const transform: (r: any) => iPage<T, C> | undefined = props.transform || ((v) => v);
			const result = await page?.(v);

			return transform(result);
		};
	};

	function isContent(c?: iPage<T, C>): boolean {
		return !!c?.edges?.length;
	}

	/**
	 * Override emit to handle node hydration
	 *
	 * @param value Content is available
	 * @param page Current page
	 * @param hydratePage Function to hydrate nodes
	 */
	function hasContent(
		value: boolean,
		page?: iPage<T, C> | null,
		hydratePage?: (newContent: iPage<T, C> | null, newErrors?: unknown) => void
	) {
		function hydrateNodesFn(newContent: T[] | null, newErrors?: unknown) {
			if (!page || !hydratePage) return;

			const edges: iPageEdge<T, C>[] = (newContent || []).map((node) => {
				const cursor = <C>cursorEncoder?.(node) || (node as any)?.id;

				return { node, cursor };
			});

			hydratePage({ ...page, edges }, newErrors);
		}

		hydrateNodes.value = hydrateNodesFn;

		const nodes = (page?.edges || []).map(({ node }) => node);

		emit("has-content", value, nodes, hydrateNodesFn);
	}

	/**
	 * Check if pagination controls should be shown
	 *
	 * @param totalCount Count of items
	 * @param first Number of items per page
	 */
	function showControls(totalCount: number, first = defaultFirst || 10) {
		if (!props.hideControls) return true;

		return props.hideControls === "single" ? totalCount > first : true;
	}
</script>
