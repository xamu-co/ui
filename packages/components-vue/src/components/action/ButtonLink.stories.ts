import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ButtonLink from "./ButtonLink.vue";

const meta = {
	title: "Action/Action Button Link",
	component: ButtonLink,
	args: { default: `Action Button link` },
} satisfies Meta<typeof ButtonLink>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { default: `Action Button link` },
};

export default meta;
