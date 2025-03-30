import type { Meta, StoryObj } from "@storybook/vue3";

import ButtonToggle from "./ButtonToggle.vue";

const meta = {
	title: "Action/Action Button Toggle",
	component: ButtonToggle as Record<keyof typeof ButtonToggle, unknown>,
	args: { default: "Action Button Toggle" },
} satisfies Meta<typeof ButtonToggle>;

type Story = StoryObj<typeof ButtonToggle>;

export const Sample: Story = {
	args: { default: "Action Button Toggle" },
};

export default meta;
