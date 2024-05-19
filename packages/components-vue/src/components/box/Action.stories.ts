import type { Meta, StoryObj } from "@storybook/vue3";

import Action from "./Action.vue";

const meta = {
	title: "Box/Box Action",
	component: Action as Record<keyof typeof Action, unknown>,
	args: { text: "Box Action", icon: "cubes" },
} satisfies Meta<typeof Action>;

type Story = StoryObj<typeof Action>;

export const Sample: Story = {
	args: { text: "Box Action", icon: "cubes" },
};

export default meta;
