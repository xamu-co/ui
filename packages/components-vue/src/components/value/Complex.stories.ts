import type { Meta, StoryObj } from "@storybook/vue3";

import Complex from "./Complex.vue";

const meta = {
	title: "Value/Value Complex",
	component: Complex as Record<keyof typeof Complex, unknown>,
	args: {},
} satisfies Meta<typeof Complex>;

type Story = StoryObj<typeof Complex>;

export const Sample: Story = {
	args: {},
};

export default meta;
