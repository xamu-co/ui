import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Simple from "./Simple.vue";

const meta = {
	title: "Loader/Loader Simple",
	component: Simple,
	args: {},
} satisfies Meta<typeof Simple>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export default meta;
