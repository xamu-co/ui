import type { StoryObj } from "@storybook/vue3-vite";

import type { GenericMeta } from "../../types/storybook";

import Simple from "./Simple.vue";

const meta = {
	title: "Pagination/Pagination Simple",
	component: Simple,
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
} satisfies GenericMeta<typeof Simple>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
