import type { Meta, StoryObj } from "@storybook/vue3";

import Content from "./Content.vue";

const meta = {
	title: "Pagination/Pagination Content",
	component: Content as Record<keyof typeof Content, unknown>,
	args: {},
} satisfies Meta<typeof Content>;

type Story = StoryObj<typeof Content>;

export const Sample: Story = {
	args: {},
};

export default meta;
