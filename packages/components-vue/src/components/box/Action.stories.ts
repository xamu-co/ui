import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Action from "./Action.vue";

const meta = {
	title: "Box/Box Action",
	component: Action,
	args: { label: "Box Action", icon: "cubes" },
} satisfies Meta<typeof Action>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { label: "Box Action", icon: "cubes" },
};

export default meta;
