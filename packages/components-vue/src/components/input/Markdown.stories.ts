import type { Meta, StoryObj } from "@storybook/vue3";

import Markdown from "./Markdown.vue";

const meta = {
	title: "Input/Input Markdown",
	component: Markdown as Record<keyof typeof Markdown, unknown>,
	args: {},
} satisfies Meta<typeof Markdown>;

type Story = StoryObj<typeof Markdown>;

export const Sample: Story = {
	args: {},
};

export default meta;
