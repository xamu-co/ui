<template>
	<LoaderContentFetch
		v-slot="{ content, refresh }"
		:promise="patchedPromise"
		:payload="[{ ...pagination, ...defaults }]"
		:class="$attrs.class"
		v-bind="{ preventAutoload, theme, noContentMessage, label, isContent, url, ignoreErrors }"
		@refresh="$emit('refresh', $event)"
	>
		<slot
			v-bind="{
				content: processContent(content.edges.map(({ node }) => node)),
				pagination,
				currentPage: content,
				refresh,
			}"
		></slot>
		<PaginationSimple
			v-if="!hideControls"
			v-model="pagination"
			v-bind="{ currentPage: content, withRoute, theme }"
		/>
	</LoaderContentFetch>
</template>

<script setup lang="ts" generic="T, C extends string | number = string, R = never">
	import { computed, getCurrentInstance, inject, ref } from "vue";

	import type {
		iGetPage,
		iPage,
		iPagination,
		iPluginOptions,
	} from "@open-xamu-co/ui-common-types";

	import LoaderContentFetch from "../loader/ContentFetch.vue";
	import PaginationSimple from "./Simple.vue";

	import type { iUseThemeProps } from "../../types/props";
	import { useOrderBy } from "../../composables/utils";

	export interface iPCProps<Ti, Ci extends string | number = string, Ri = never>
		extends iPagination,
			iUseThemeProps {
		/**
		 * Function used to fetch the page
		 */
		page: Ri extends iGetPage<Ti, Ci>
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
		 */
		hideControls?: boolean;
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
	const emit = defineEmits(["refresh", "hasContent"]);

	const xamuOptions = inject<iPluginOptions>("xamu");
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;

	/**
	 * Patched promise
	 */
	const patchedPromise: iGetPage<T, C> = async (v) => {
		const transform: (r: any) => iPage<T, C> | undefined = props.transform || ((v) => v);
		const page = await props.page(v);

		return transform(page);
	};
	const propsPagination = ref<iPagination>({
		orderBy: props.orderBy,
		first: props.first ?? xamuOptions?.first,
		at: props.at,
	});
	const routePagination = computed<iPagination>(() => {
		if (!router) return {};

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
	});
	const pagination = computed<iPagination>({
		get() {
			if (props.withRoute) return routePagination.value;

			return propsPagination.value;
		},
		set(newPagination) {
			if (props.withRoute) {
				if (!router) return;

				const route = router.currentRoute.value;

				return router.push({
					path: route.path,
					hash: route.hash,
					query: { ...route.query, ...newPagination },
				});
			}

			propsPagination.value = newPagination;
		},
	});

	function isContent(c?: iPage<T, C>): boolean {
		const hasContent = !!c?.edges.length;

		emit("hasContent", hasContent);

		return hasContent;
	}
</script>
