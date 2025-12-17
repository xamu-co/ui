import type { Meta, StoryObj } from "@storybook/vue3-vite";

import SliderSimple from "./Simple.vue";

const meta: Meta<typeof SliderSimple> = {
	title: "Slider",
	component: SliderSimple,
	args: {},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
