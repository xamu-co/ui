<template>
	<LoaderContentFetch
		v-slot="{ content, refresh }"
		:promise="page"
		:payload="[pagination]"
		v-bind="{ ...$attrs, preventAutoload, theme }"
	>
		<slot
			v-bind="{
				content: content.edges.map(({ node }) => node),
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

<script setup lang="ts" generic="T, C extends string | number = string">
	import { computed, getCurrentInstance, inject, ref } from "vue";

	import type {
		iGetPage,
		iPagination,
		iPluginOptions,
		tOrderBy,
	} from "@open-xamu-co/ui-common-types";

	import LoaderContentFetch from "../loader/ContentFetch.vue";
	import PaginationSimple from "./Simple.vue";

	import type { iUseThemeProps } from "../../types/props";

	export interface iPaginationContentProps<Ti, Ci extends string | number = string>
		extends iPagination,
			iUseThemeProps {
		/**
		 * Function used to fetch the page
		 */
		page: iGetPage<Ti, Ci>;
		/**
		 * paginate using route
		 */
		withRoute?: boolean;
		/**
		 * hide pagination buttons
		 */
		hideControls?: boolean;
		preventAutoload?: boolean;
	}

	/**
	 * Menu de paginacion [PROGRESS]
	 * Redirecciona a la misma ruta + el query de pagina
	 * TODO: Add conditional items per page selector
	 * Not sure what this was supposed to mean
	 *
	 * @component
	 * @example
	 * <PaginationContent></PaginationContent>
	 */

	defineOptions({ name: "PaginationContent", inheritAttrs: false });

	const props = defineProps<iPaginationContentProps<T, C>>();

	const xamuOptions = inject<iPluginOptions>("xamu");
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;

	const propsPagination = ref<iPagination>({
		orderBy: props.orderBy,
		first: props.first ?? xamuOptions?.first,
		at: props.at,
	});
	const routePagination = computed<iPagination>(() => {
		if (!router) return {};

		const route = router.currentRoute.value;
		const newPagination = { ...propsPagination.value };
		/**
		 * TODO: support multiple order params
		 * @example { price: "asc", createdAt: "desc", }
		 */
		const [cursorName, order] = Array.isArray(route.query.orderBy) ? route.query.orderBy : [];
		const ascOrDesc = order === "asc" || order === "desc" ? order : "desc";
		const orderBy: tOrderBy = [cursorName ?? "createdAt", ascOrDesc];
		const first = route.query.first;
		const at = route.query.at;

		newPagination.orderBy = orderBy;

		if (first && !Array.isArray(first)) newPagination.first = Number(first);
		if (at && !Array.isArray(at)) {
			const newAt = Number(at);

			newPagination.at = isNaN(newAt) ? at : newAt;
		}

		return newPagination;
	});
	const pagination = computed<iPagination | undefined>({
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
</script>
