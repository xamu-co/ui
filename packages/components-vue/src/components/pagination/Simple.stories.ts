import type { Meta, StoryObj } from "@storybook/vue3";

import Simple from "./Simple.vue";

const meta = {
	title: "Pagination/Pagination Simple",
	component: Simple as Record<keyof typeof Simple, unknown>,
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
} satisfies Meta<typeof Simple>;

type Story = StoryObj<typeof Simple>;

export const Sample: Story = {
	args: {},
};

export default meta;
