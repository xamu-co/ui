import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, userEvent, expect } from "storybook/test";

import InputText from "./Text.vue";

const meta: Meta<typeof InputText> = {
	title: "Input/Input Text",
	component: InputText,
	args: { icon: "cubes", placeholder: "What is your name?" },
	tags: ["test"],
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { icon: "cubes", placeholder: "What is your name?" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText("What is your name?");

		expect(input).toBeInTheDocument();
		expect(input).toHaveValue("");
		await userEvent.type(input, "John Doe");
		expect(input).toHaveValue("John Doe");
	},
};

export default meta;
