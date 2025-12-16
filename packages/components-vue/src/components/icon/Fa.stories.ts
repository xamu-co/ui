import type { Meta, StoryObj } from "@storybook/vue3-vite";

import IconFa from "./Fa.vue";

const meta: Meta<typeof IconFa> = {
	title: "Icon/Icon Fa",
	component: IconFa,
	args: { name: "cubes" },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { name: "cubes" },
};

export const Large: Story = {
	args: { name: "cubes", size: 50 },
};

export default meta;
