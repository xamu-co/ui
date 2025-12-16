import type { StoryObj } from "@storybook/vue3-vite";

import type { GenericMeta } from "../../types/storybook";

import Content from "./Content.vue";

const meta: GenericMeta<typeof Content> = {
	title: "Pagination/Pagination Content",
	component: Content,
	args: {},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
