<template>
	<ul
		v-if="currentPage && modelValue"
		:class="
			$attrs.class ||
			'flx --flxRow-wrap --flx-center --gap-5 --gap-10:sm --gap:md --width-fit'
		"
	>
		<li v-if="modelValue.first">
			<p class="--txtSize-sm">
				{{ t("pagination_items", currentPage.totalCount) }}
				⋅
				{{ pageCountText }}
			</p>
		</li>
		<li v-if="!hidePageLength && currentPage.totalCount > 5">
			<ul class="flx --flxRow-wrap --flx-center --gap-5 --gap:sm">
				<li>
					<SelectSimple
						id="first"
						v-model="firstModel"
						:theme="theme"
						class="--maxWidthVw-60"
						name="first"
						:options="[5, 10, 25, 50, 100]"
					/>
				</li>
				<template v-if="currentPage.totalCount > currentPage.edges.length">
					<li>
						<!-- Reset at if coming from second page -->
						<ActionButtonToggle
							:theme="theme"
							:aria-label="t('previous')"
							:disabled="!pageInfo?.hasPreviousPage"
							round=":sm-inv"
							@click="setAt(pageNumber > 2 ? pageInfo?.previousCursor : undefined)"
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
							:disabled="!pageInfo?.hasNextPage"
							round=":sm-inv"
							@click="setAt(pageInfo?.nextCursor)"
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
	import { computed, inject } from "vue";

	import type { iPagination, iPage, iPluginOptions } from "@open-xamu-co/ui-common-types";
	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import SelectSimple from "../select/Simple.vue";

	import type { iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";

	export interface iPaginationSimpleProps<Ti, Ci extends string | number> extends iUseThemeProps {
		/**
		 * hide page length picker
		 */
		hidePageLength?: boolean;
		/**
		 * pagination params
		 */
		modelValue?: iPagination;
		currentPage?: iPage<Ti, Ci> | null;
	}

	/**
	 * Pagination controls
	 *
	 * @component
	 * @example
	 * <PaginationSimple></PaginationSimple>
	 */

	defineOptions({ name: "PaginationSimple", inheritAttrs: false });

	const emit = defineEmits(["update:model-value"]);
	const props = defineProps<iPaginationSimpleProps<T, C>>();

	const { first: defaultFirst } = inject<iPluginOptions>("xamu") || {};
	const { t } = useHelpers(useI18n);

	const pageInfo = computed(() => props.currentPage?.pageInfo);
	const pageNumber = computed(() => props.currentPage?.pageInfo?.pageNumber || 0);

	/**
	 * PaginationSimple first model
	 */
	const firstModel = computed({
		get: () => props.modelValue?.first ?? defaultFirst ?? 0,
		set(first) {
			emit("update:model-value", { ...props.modelValue, first, at: undefined });
		},
	});

	const pageCountText = computed(() => {
		const page = props.currentPage?.pageInfo.pageNumber || 1;
		const totalCount = props.currentPage?.totalCount ?? 0;
		const pagesText = t("pagination_pages", Math.ceil(totalCount / firstModel.value));

		if (page > 1) {
			const pageText = t("pagination_page", page);

			return `${pageText} ${pagesText}`;
		}

		return pagesText;
	});

	/**
	 * Set at
	 * preserve route/pagination
	 *
	 * @replace
	 */
	function setAt(at?: string | number) {
		emit("update:model-value", { ...props.modelValue, at });
	}
</script>
