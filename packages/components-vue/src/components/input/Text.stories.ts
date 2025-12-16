import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Text from "./Text.vue";

const meta = {
	title: "Input/Input Text",
	component: Text,
	args: { icon: "cubes", placeholder: "What is your name?" },
} satisfies Meta<typeof Text>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { icon: "cubes", placeholder: "What is your name?" },
};

export default meta;
