import type { Meta, StoryObj } from "@storybook/vue3";

import Button from "./Button.vue";

const meta = {
	title: "Action/Action Button",
	component: Button as Record<keyof typeof Button, unknown>,
	args: { default: "Action Button" },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Sample: Story = {
	args: { default: "Action Button" },
};

export default meta;
