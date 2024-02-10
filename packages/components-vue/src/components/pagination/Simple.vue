<template>
	<ul
		v-if="currentPage && modelValue"
		class="flx --flxRow-wrap --flx-center --gap-5 --gap:sm --width-fit"
	>
		<li v-if="modelValue.first">
			<p class="--txtSize-sm">
				{{ t("pagination_items", currentPage.totalCount) }}
				⋅
				{{ t("pagination_pages", Math.ceil(currentPage.totalCount / modelValue.first)) }}
			</p>
		</li>
		<li v-if="!hidePageLength && currentPage.totalCount > 5">
			<ul class="flx --flxRow-wrap --flx-center --gap-5 --gap:sm">
				<li>
					<SelectSimple
						id="order"
						v-model="firstModel"
						:theme="theme"
						class="--maxWidthVw-60"
						name="order"
						:options="[5, 10, 25, 50, 100]"
					/>
				</li>
				<template v-if="currentPage.totalCount > currentPage.edges.length">
					<li>
						<ActionButtonToggle
							:theme="theme"
							:aria-label="t('previous')"
							:disabled="!currentPage.pageInfo.hasPreviousPage"
							round=":sm-inv"
							@click="currentPage && setAt(currentPage.pageInfo?.previousCursor)"
						>
							<IconFa name="arrow-left" />
							<IconFa name="arrow-left" regular />
							<span class="--hidden-full:sm-inv">{{ t("previous") }}</span>
						</ActionButtonToggle>
					</li>
					<li>
						<ActionButtonToggle
							:theme="theme"
							:aria-label="t('next')"
							:disabled="!currentPage.pageInfo.hasNextPage"
							round=":sm-inv"
							@click="currentPage && setAt(currentPage.pageInfo?.nextCursor)"
						>
							<span class="--hidden-full:sm-inv">{{ t("next") }}</span>
							<IconFa name="arrow-right" />
							<IconFa name="arrow-left" regular />
						</ActionButtonToggle>
					</li>
				</template>
			</ul>
		</li>
	</ul>
</template>

<script setup lang="ts" generic="T, C extends string | number">
	import { computed, getCurrentInstance, inject } from "vue";

	import type { iPagination, iPage, iPluginOptions } from "@open-xamu-co/ui-common-types";
	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import SelectSimple from "../select/Simple.vue";

	import type { iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";

	export interface iPaginationSimpleProps<Ti, Ci extends string | number> extends iUseThemeProps {
		/**
		 * paginate using route
		 */
		withRoute?: boolean;
		/**
		 * hide page length picker
		 */
		hidePageLength?: boolean;
		/**
		 * pagination params
		 */
		modelValue?: iPagination;
		currentPage: iPage<Ti, Ci> | null;
	}

	/**
	 * Pagination controls
	 * TODO: support non router pagination
	 *
	 * @component
	 * @example
	 * <PaginationSimple></PaginationSimple>
	 */

	defineOptions({ name: "PaginationSimple", inheritAttrs: false });

	const emit = defineEmits(["update:pagination"]);
	const props = defineProps<iPaginationSimpleProps<T, C>>();

	const xamuOptions = inject<iPluginOptions>("xamu");
	const { t } = useHelpers(useI18n);
	const router = getCurrentInstance()?.appContext.config.globalProperties.$router;

	/**
	 * Set at
	 * preserve route/pagination
	 *
	 * @replace
	 */
	function setAt(at?: string | number) {
		if (props.withRoute) {
			if (!router) return;

			const route = router.currentRoute.value;

			return router.push({ path: route.path, query: { ...route.query, at } });
		}

		const pagination: iPagination = { ...props.modelValue, at };

		emit("update:pagination", pagination);
	}

	/**
	 * PaginationSimple first model
	 */
	const firstModel = computed({
		get: () => props.modelValue?.first ?? xamuOptions?.first,
		set(first) {
			if (props.withRoute) {
				if (!router) return;

				const route = router.currentRoute.value;

				return router.push({ path: route.path, query: { first } });
			}

			const pagination: iPagination = { ...props.modelValue, first };

			emit("update:pagination", pagination);
		},
	});
</script>
