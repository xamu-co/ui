import type { Meta, StoryObj } from "@storybook/vue3";

import ContentFetch from "./ContentFetch.vue";

const meta = {
	title: "Loader/Loader Content Fetch",
	component: ContentFetch as Record<keyof typeof ContentFetch, unknown>,
	args: {},
} satisfies Meta<typeof ContentFetch>;

type Story = StoryObj<typeof ContentFetch>;

export const Sample: Story = {
	args: {},
};

export default meta;
