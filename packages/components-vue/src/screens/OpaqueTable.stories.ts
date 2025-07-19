import type { Meta, StoryObj } from "@storybook/vue3";

import OpaqueTable from "./OpaqueTable.vue";

const meta = {
	title: "Screens/Opaque table",
	component: OpaqueTable as Record<keyof typeof OpaqueTable, unknown>,
	args: {},
	tags: ["!autodocs"],
} satisfies Meta<typeof OpaqueTable>;

type Story = StoryObj<typeof OpaqueTable>;

export const Sample: Story = {
	args: {},
};

export default meta;
