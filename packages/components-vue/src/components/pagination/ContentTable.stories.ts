import type { StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import type { GenericMeta } from "../../types/storybook";

import PaginationContentTable from "./ContentTable.vue";

import type { tOrderBy, iPagination, iFormResponse, iPage } from "@open-xamu-co/ui-common-types";

const meta = {
	title: "Pagination/Pagination ContentTable",
	component: PaginationContentTable,
	args: {},
} satisfies GenericMeta<typeof PaginationContentTable>;

type Story = StoryObj<typeof meta>;

// TODO: Add data mocks

export const Sample: Story = {
	args: {
		url: "",
		page: (() => {}) as any,
	},
};

export const Data: Story = {
	args: {
		url: "",
		page: (() => {}) as any,
	},
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

			async function page(_params?: iPagination) {
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

				return new Promise<iPage<iSector, number> | undefined>((resolve) => {
					setTimeout(() => {
						resolve(data.response);
					}, 3000);
				});
			}

			return { args, sort, page };
		},
		template: `
			<PaginationContentTable v-bind="args" :page="page" />
		`,
	}),
};

export default meta;
