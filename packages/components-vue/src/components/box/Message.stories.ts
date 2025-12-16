import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Message from "./Message.vue";

const meta = {
	title: "Box/Box Message",
	component: Message,
	args: { text: "Here is a box message" },
} satisfies Meta<typeof Message>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
