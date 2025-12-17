import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ActionButtonLink from "./ButtonLink.vue";

const meta: Meta<typeof ActionButtonLink> = {
	title: "Action/Action Button Link",
	component: ActionButtonLink,
	args: { default: `Action Button link` },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { default: `Action Button link` },
};

export default meta;
