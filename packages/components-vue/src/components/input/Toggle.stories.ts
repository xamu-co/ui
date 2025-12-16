import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Toggle from "./Toggle.vue";

const meta = {
	title: "Input/Input Toggle",
	component: Toggle,
	args: { label: "Toggle checkbox" },
} satisfies Meta<typeof Toggle>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { label: "Toggle checkbox" },
};

export default meta;
