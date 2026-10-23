import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, userEvent, expect } from "storybook/test";

import InputToggle from "./Toggle.vue";

const meta: Meta<typeof InputToggle> = {
	title: "Input/Input Toggle",
	component: InputToggle,
	args: { label: "Toggle checkbox" },
	tags: ["test"],
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { label: "Toggle checkbox" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const checkbox = canvas.getByRole("checkbox", { hidden: true });

		expect(checkbox).toBeInTheDocument();
		expect(checkbox).not.toBeChecked();
		await userEvent.click(checkbox);
		expect(checkbox).toBeChecked();
	},
};

export default meta;
