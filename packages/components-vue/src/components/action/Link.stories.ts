import type { Meta, StoryObj } from "@storybook/vue3";

import Link from "./Link.vue";

const meta = {
	title: "Action/Action Link",
	component: Link as Record<keyof typeof Link, unknown>,
	args: { default: "Action Link" },
} satisfies Meta<typeof Link>;

type Story = StoryObj<typeof Link>;

export const Sample: Story = {
	args: { default: "Action Link" },
};

export default meta;
