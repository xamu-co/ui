import type { Meta, StoryObj } from "@storybook/vue3-vite";

import LoaderSimple from "./Simple.vue";

const meta: Meta<typeof LoaderSimple> = {
	title: "Loader/Loader Simple",
	component: LoaderSimple,
	args: {},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
