import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";

import PaginationContentTable from "./ContentTable.vue";

import type { tOrderBy, iPagination, iFormResponse, iPage } from "@open-xamu-co/ui-common-types";

const meta = {
	title: "Pagination/Pagination ContentTable",
	component: PaginationContentTable as Record<keyof typeof PaginationContentTable, unknown>,
	args: {},
} satisfies Meta<typeof PaginationContentTable>;

type Story = StoryObj<typeof PaginationContentTable>;

export const Sample: Story = {
	args: {},
};

export const Data: Story = {
	render: (args) => ({
		components: { PaginationContentTable },
		setup() {
			interface iSector {
				id: number;
				name: string;
				description: string;
				categories: string[];
			}

			const sort = ref<tOrderBy>();

			const page = async (
				_params?: iPagination
			): Promise<iPage<iSector, number> | undefined> => {
				const data: iFormResponse<iPage<iSector, number>> = {
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
							pageNumber: 1,
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
						resolve(data.response);
					}, 3000);
				});
			};

			return { args, sort, page };
		},
		template: `
			<PaginationContentTable v-bind="args" :page="page" :transform="getPageFromResponse" />
		`,
	}),
	args: {},
};

export default meta;
