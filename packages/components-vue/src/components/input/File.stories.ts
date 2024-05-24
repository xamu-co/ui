import type { Meta, StoryObj } from "@storybook/vue3";

import File from "./File.vue";

const meta = {
	title: "Input/Input File",
	component: File as Record<keyof typeof File, unknown>,
	args: { modelValue: [] },
} satisfies Meta<typeof File>;

type Story = StoryObj<typeof File>;

export const Sample: Story = {
	args: { modelValue: [] },
};

export default meta;
