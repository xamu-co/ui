import type { Meta, StoryObj } from "@storybook/vue3";

import ButtonLink from "./ButtonLink.vue";

const meta = {
	title: "Action/Action Button Link",
	component: ButtonLink as Record<keyof typeof ButtonLink, unknown>,
	args: { default: `Action Button link` },
} satisfies Meta<typeof ButtonLink>;

type Story = StoryObj<typeof ButtonLink>;

export const Sample: Story = {
	args: { default: `Action Button link` },
};

export default meta;
