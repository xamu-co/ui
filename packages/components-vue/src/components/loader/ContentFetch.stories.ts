import type { StoryObj } from "@storybook/vue3-vite";

import type { GenericMeta } from "../../types/storybook";

import ContentFetch from "./ContentFetch.vue";

const meta = {
	title: "Loader/Loader Content Fetch",
	component: ContentFetch,
	args: {},
} satisfies GenericMeta<typeof ContentFetch>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
