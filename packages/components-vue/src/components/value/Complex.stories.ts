import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Complex from "./Complex.vue";

const meta = {
	title: "Value/Value Complex",
	component: Complex,
	args: {},
} satisfies Meta<typeof Complex>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {
		value: ["Valor 1", "Valor 2", "Valor 3"],
	},
};

export default meta;
