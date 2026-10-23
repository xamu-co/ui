import type { StoryObj } from "@storybook/vue3-vite";

import type { GenericMeta } from "../../types/storybook";

import PaginationSimple from "./Simple.vue";

const meta: GenericMeta<typeof PaginationSimple> = {
	title: "Pagination/Pagination Simple",
	component: PaginationSimple,
	args: {
		modelValue: {
			at: 0,
			first: 10,
		},
		currentPage: {
			edges: [],
			pageInfo: {
				hasNextPage: false,
				hasPreviousPage: false,
			},
			totalCount: 0,
		},
	},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
