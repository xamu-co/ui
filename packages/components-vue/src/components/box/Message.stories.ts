import type { Meta, StoryObj } from "@storybook/vue3";

import Message from "./Message.vue";

const meta = {
	title: "Box/Box Message",
	component: Message as Record<keyof typeof Message, unknown>,
	args: { default: "Box Message" },
} satisfies Meta<typeof Message>;

type Story = StoryObj<typeof Message>;

export const Sample: Story = {
	args: { default: "Box Message" },
};

export default meta;
