import type { Meta, StoryObj } from "@storybook/vue3-vite";

import InputText from "./Text.vue";

const meta: Meta<typeof InputText> = {
	title: "Input/Input Text",
	component: InputText,
	args: { icon: "cubes", placeholder: "What is your name?" },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { icon: "cubes", placeholder: "What is your name?" },
};

export default meta;
