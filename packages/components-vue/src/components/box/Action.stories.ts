import type { Meta, StoryObj } from "@storybook/vue3-vite";

import BoxAction from "./Action.vue";

const meta: Meta<typeof BoxAction> = {
	title: "Box/Box Action",
	component: BoxAction,
	args: { label: "Box Action", icon: "cubes" },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { label: "Box Action", icon: "cubes" },
};

export default meta;
