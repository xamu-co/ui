import type { Meta, StoryObj } from "@storybook/vue3-vite";

import LoaderContent from "./Content.vue";

const meta: Meta<typeof LoaderContent> = {
	title: "Loader/Loader Content",
	component: LoaderContent,
	args: {},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
