import type { Meta, StoryObj } from "@storybook/vue3";

import Text from "./Text.vue";

const meta = {
	title: "Input/Input Text",
	component: Text as Record<keyof typeof Text, unknown>,
	args: { icon: "cubes", placeholder: "What is your name?" },
} satisfies Meta<typeof Text>;

type Story = StoryObj<typeof Text>;

export const Sample: Story = {
	args: { icon: "cubes", placeholder: "What is your name?" },
};

export default meta;
