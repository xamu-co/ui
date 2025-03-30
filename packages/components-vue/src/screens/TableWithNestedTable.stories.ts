import type { Meta, StoryObj } from "@storybook/vue3";

import TableWithNestedTable from "./TableWithNestedTable.vue";

const meta = {
	title: "Screens/Table with nested table",
	component: TableWithNestedTable as Record<keyof typeof TableWithNestedTable, unknown>,
	args: {},
	tags: ["!autodocs"],
} satisfies Meta<typeof TableWithNestedTable>;

type Story = StoryObj<typeof TableWithNestedTable>;

export const Sample: Story = {
	args: {},
};

export default meta;
