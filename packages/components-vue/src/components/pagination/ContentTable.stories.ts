import type { Meta, StoryObj } from "@storybook/vue3";

import ContentTable from "./ContentTable.vue";

const meta = {
	title: "Pagination/Pagination ContentTable",
	component: ContentTable as Record<keyof typeof ContentTable, unknown>,
	args: {},
} satisfies Meta<typeof ContentTable>;

type Story = StoryObj<typeof ContentTable>;

export const Sample: Story = {
	args: {},
};

export default meta;
