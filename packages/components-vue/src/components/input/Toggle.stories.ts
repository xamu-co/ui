import type { Meta, StoryObj } from "@storybook/vue3-vite";

import InputToggle from "./Toggle.vue";

const meta: Meta<typeof InputToggle> = {
	title: "Input/Input Toggle",
	component: InputToggle,
	args: { label: "Toggle checkbox" },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { label: "Toggle checkbox" },
};

export default meta;
