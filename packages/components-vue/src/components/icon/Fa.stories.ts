import type { Meta, StoryObj } from "@storybook/vue3";

import Fa from "./Fa.vue";

const meta = {
	title: "Icon/Icon Fa",
	component: Fa as Record<keyof typeof Fa, unknown>,
	args: { name: "cubes" },
} satisfies Meta<typeof Fa>;

type Story = StoryObj<typeof Fa>;

export const Sample: Story = {
	args: { name: "cubes" },
};

export const Large: Story = {
	args: { name: "cubes", size: 50 },
};

export default meta;
