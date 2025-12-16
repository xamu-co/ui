import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ValueComplex from "./Complex.vue";

const meta: Meta<typeof ValueComplex> = {
	title: "Value/Value Complex",
	component: ValueComplex,
	args: {},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {
		value: ["Valor 1", "Valor 2", "Valor 3"],
	},
};

export default meta;
