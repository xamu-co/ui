import type { Meta, StoryObj } from "@storybook/vue3-vite";

import IconSimple from "./Simple.vue";

const meta: Meta<typeof IconSimple> = {
	title: "Icon/Icon Simple",
	component: IconSimple,
	args: {},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
