<template>
	<LoaderContentFetch
		v-slot="{ content, refresh }"
		:promise="patchedPromise"
		:payload="[{ ...pagination, ...defaults }]"
		:class="$attrs.class"
		v-bind="{ preventAutoload, theme, noContentMessage, label, isContent }"
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

<script setup lang="ts" generic="T, C extends string | number = string, R extends any = any">
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

	export interface iPCBaseProps<Ti> extends iPagination, iUseThemeProps {
		/**
		 * Function used to fetch the page
		 */
		page: any;
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
		transform?: any;
		/**
		 * When additional operations are required on content
		 *
		 * Nodes arr only
		 */
		processContent?: (n: Ti[]) => Ti[];
	}

	export interface iPCProps<Ti, Ci extends string | number = string> extends iPCBaseProps<Ti> {
		page: iGetPage<Ti, Ci>;
		transform?: undefined;
	}
	export interface iPCWithTransformProps<Ti, Ci extends string | number = string, Ri = any>
		extends iPCBaseProps<Ti> {
		page: (params?: iPagination) => Promise<Ri | undefined>;
		transform: (r: Ri) => iPage<Ti, Ci> | undefined;
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

	const props = withDefaults(defineProps<iPCProps<T, C> | iPCWithTransformProps<T, C, R>>(), {
		processContent: (c: T[]) => c,
	});

	defineEmits(["refresh"]);

	const xamuOptions = inject<iPluginOptions>("xamu");
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;

	/**
	 * Patched promise
	 */
	const patchedPromise = computed<iGetPage<T, C>>(() => {
		const transform: (r: any) => iPage<T, C> | undefined = props.transform || ((v) => v);

		return async (v) => transform(await props.page(v));
	});

	const propsPagination = ref<iPagination>({
		orderBy: props.orderBy,
		first: props.first ?? xamuOptions?.first,
		at: props.at,
	});
	const routePagination = computed<iPagination>(() => {
		if (!router) return {};

		const { first, at } = propsPagination.value;

		const route = router.currentRoute.value;
		const newPagination: iPagination = { first, at };
		const routeFirst = route.query.first;

		if (routeFirst && !Array.isArray(routeFirst)) newPagination.first = Number(first);

		const routeAt = route.query.at;

		if (routeAt && !Array.isArray(at)) {
			const newAt = Number(at);

			newPagination.at = isNaN(newAt) ? routeAt : newAt;
		}

		newPagination.orderBy = useOrderBy(route.query.orderBy);

		return newPagination;
	});
	const pagination = computed<iPagination>({
		get() {
			if (props.withRoute) return routePagination.value;

			return propsPagination.value;
		},
		set(newPagination) {
			propsPagination.value = {
				orderBy: newPagination?.orderBy ?? propsPagination.value?.orderBy,
				first: newPagination?.first ?? propsPagination.value?.first,
				at: newPagination?.at ?? propsPagination.value?.at,
			};
		},
	});

	function isContent(c?: iPage<T, C>): boolean {
		return !!c?.edges.length;
	}
</script>
