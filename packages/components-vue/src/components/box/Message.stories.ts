import type { Meta, StoryObj } from "@storybook/vue3-vite";

import BoxMessage from "./Message.vue";

const meta: Meta<typeof BoxMessage> = {
	title: "Box/Box Message",
	component: BoxMessage,
	args: { text: "Here is a box message" },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
