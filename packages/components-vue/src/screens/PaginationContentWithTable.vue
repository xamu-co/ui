<template>
	<PaginationContent
		v-slot="{ content }"
		:page="page"
		:transform="getPageFromResponse"
		with-route
		class="flx --flxColumn --flx-start-end --gap-5 --width-100"
	>
		<Table
			v-model:sort="sort"
			:nodes="content"
			:modal-props="{ theme: [eColors.LIGHT, eColors.SECONDARY], class: '--txtColor' }"
		/>
	</PaginationContent>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	import type {
		iFormResponse,
		iPage,
		iPagination,
		tOrderBy,
	} from "@open-xamu-co/ui-common-types";
	import { eColors } from "@open-xamu-co/ui-common-enums";

	import PaginationContent from "../components/pagination/Content.vue";
	import Table from "../components/table/Simple.vue";

	export interface iSector {
		id: number;
		categories: Record<string, any>[];
		name: string;
		description: string;
	}

	/**
	 * Pagination Content with Table
	 *
	 * @screen
	 */

	const sort = ref<tOrderBy>();

	const page = async (_params?: iPagination): Promise<iFormResponse<iPage<iSector, number>>> => {
		const data = {
			response: {
				edges: [
					{
						cursor: 2,
						node: {
							id: 2,
							name: "Agropecuario",
							description: "Este es el sector agropecuario",
							categories: [],
						},
					},
					{
						cursor: 1,
						node: {
							id: 1,
							name: "Tecnológico",
							description:
								"Este sector incluye todo tipo de electrodomésticos y dispositivos.",
							categories: [],
						},
					},
				],
				pageInfo: {
					hasNextPage: false,
					hasPreviousPage: false,
				},
				totalCount: 2,
			},
			invalidInputs: [],
			withErrors: false,
			requestHadErrors: false,
			validationHadErrors: false,
		};

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(data);
			}, 3000);
		});
	};

	const getPageFromResponse = ({ response }: iFormResponse<iPage<iSector, number>>) => {
		return response;
	};
</script>
