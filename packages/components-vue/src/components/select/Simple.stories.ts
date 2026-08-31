import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, userEvent, expect } from "storybook/test";

import type { iSelectOption } from "@open-xamu-co/ui-common-types";

import SelectSimple from "./Simple.vue";

const options: iSelectOption[] = [
	{ value: "TITLE" },
	{ value: "LONG_TEXT" },
	{ value: "SHORT_TEXT" },
	{ value: "ROW_NUMBER_VALUE" },
	{ value: "ROW_TEXT_VALUE" },
];
const meta: Meta<typeof SelectSimple> = {
	title: "Select/Select Simple",
	component: SelectSimple,
	args: { options },
	tags: ["test"],
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { options },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole("combobox");

		expect(select).toBeInTheDocument();
		expect(select).toHaveValue("TITLE");
		await userEvent.selectOptions(select, "LONG_TEXT");
		expect(select).toHaveValue("LONG_TEXT");
	},
};

export default meta;
