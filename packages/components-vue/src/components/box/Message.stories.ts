import type { Meta, StoryObj } from "@storybook/vue3";

import Message from "./Message.vue";

const meta = {
	title: "Box/Box Message",
	component: Message as Record<keyof typeof Message, unknown>,
	args: { text: "Here is a box message" },
} satisfies Meta<typeof Message>;

type Story = StoryObj<typeof Message>;

export const Sample: Story = {
	args: {},
};

export default meta;
