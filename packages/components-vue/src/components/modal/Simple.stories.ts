import type { Meta, StoryObj } from "@storybook/vue3";

import Simple from "./Simple.vue";

const meta = {
	title: "Modal",
	component: Simple as Record<keyof typeof Simple, unknown>,
	args: {},
} satisfies Meta<typeof Simple>;

type Story = StoryObj<typeof Simple>;

export const Sample: Story = {
	args: {},
};

export default meta;
