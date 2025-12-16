import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ActionLink from "./Link.vue";

const meta: Meta<typeof ActionLink> = {
	title: "Action/Action Link",
	component: ActionLink,
	args: { default: "Action Link" },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { default: "Action Link" },
};

export default meta;
