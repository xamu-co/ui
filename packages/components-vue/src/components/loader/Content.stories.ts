import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Content from "./Content.vue";

const meta = {
	title: "Loader/Loader Content",
	component: Content,
	args: {},
} satisfies Meta<typeof Content>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
