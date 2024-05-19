import type { Meta, StoryObj } from "@storybook/vue3";

import Color from "./Color.vue";

const meta = {
	title: "Input/Input Color",
	component: Color as Record<keyof typeof Color, unknown>,
	args: {},
} satisfies Meta<typeof Color>;

type Story = StoryObj<typeof Color>;

export const Sample: Story = {
	args: {},
};

export default meta;
