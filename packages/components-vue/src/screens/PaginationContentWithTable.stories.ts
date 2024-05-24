import type { Meta, StoryObj } from "@storybook/vue3";

import PaginationContentWithTable from "./PaginationContentWithTable.vue";

const meta = {
	title: "Screens/Pagination Content with Table",
	component: PaginationContentWithTable as Record<
		keyof typeof PaginationContentWithTable,
		unknown
	>,
	args: {},
	tags: ["!autodocs"],
} satisfies Meta<typeof PaginationContentWithTable>;

type Story = StoryObj<typeof PaginationContentWithTable>;

export const Sample: Story = {
	args: {},
};

export default meta;
