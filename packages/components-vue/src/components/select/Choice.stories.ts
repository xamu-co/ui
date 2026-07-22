import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, userEvent, expect, waitFor } from "storybook/test";
import { ref } from "vue";

import type { iSelectOption } from "@open-xamu-co/ui-common-types";

import SelectChoice from "./Choice.vue";

const meta: Meta<typeof SelectChoice> = {
	title: "Select/Select Choice",
	component: SelectChoice,
	args: { options: ["Single option"] },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export const WithOptions: Story = {
	render: (args) => ({
		components: { SelectChoice },
		setup() {
			const model = ref([""]);
			const options: iSelectOption[] = [
				{ value: "TITLE" },
				{ value: "LONG_TEXT" },
				{ value: "SHORT_TEXT" },
				{ value: "ROW_NUMBER_VALUE" },
				{ value: "ROW_TEXT_VALUE" },
			];

			return { args, model, options };
		},
		template: '<SelectChoice v-bind="args" v-model="model" :options="options" />',
	}),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Get the button for "LONG_TEXT"
		const optionButton = canvas.getByRole("button", { name: "LONG_TEXT" });

		expect(optionButton).toBeInTheDocument();
		expect(optionButton).not.toBeDisabled();

		// Click the option
		await userEvent.click(optionButton);
		// In single mode, the selected option is disabled
		await waitFor(() => expect(optionButton).toBeDisabled());
	},
};

export const WithMultipleOptions: Story = {
	...WithOptions,
	args: { multiple: true },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Get the button for "LONG_TEXT"
		const optionButton = canvas.getByRole("button", { name: "LONG_TEXT" });

		expect(optionButton).toBeInTheDocument();
		expect(optionButton).not.toBeDisabled();

		// Click the option
		await userEvent.click(optionButton);

		// In multiple mode, the option remains enabled
		await waitFor(() => expect(optionButton).not.toBeDisabled());
	},
};

export default meta;
