import type { Meta, StoryObj } from "@storybook/vue3";

import Toggle from "./Toggle.vue";

const meta = {
	title: "Input/Input Toggle",
	component: Toggle as Record<keyof typeof Toggle, unknown>,
	args: { label: "Toggle checkbox" },
} satisfies Meta<typeof Toggle>;

type Story = StoryObj<typeof Toggle>;

export const Sample: Story = {
	args: { label: "Toggle checkbox" },
};

export default meta;
