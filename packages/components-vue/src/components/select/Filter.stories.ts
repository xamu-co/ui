import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, userEvent, expect, waitFor } from "storybook/test";
import { ref } from "vue";

import type { iSelectOption } from "@open-xamu-co/ui-common-types";

import SelectFilter from "./Filter.vue";
import { mockOptionsLoader } from "./mocks.js";

const meta: Meta<typeof SelectFilter> = {
	title: "Select/Select Filter",
	component: SelectFilter,
	args: { options: ["Single option"] },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export const WithOptions: Story = {
	render: (args) => ({
		components: { SelectFilter },
		setup() {
			const model = ref("");
			const options: iSelectOption[] = [
				{ value: "TITLE" },
				{ value: "LONG_TEXT" },
				{ value: "SHORT_TEXT" },
				{ value: "ROW_NUMBER_VALUE" },
				{ value: "ROW_TEXT_VALUE" },
			];

			return { args, model, options };
		},
		template: '<SelectFilter v-bind="args" v-model="model" :options="options" />',
	}),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole("combobox");

		expect(input).toBeInTheDocument();
		expect(input).toHaveValue("");

		// Type "TITLE" to select the option
		await userEvent.type(input, "TITLE");
		expect(input).toHaveValue("TITLE");

		// The reset link (xmark) should be visible when value is selected
		await waitFor(() => {
			const clearButton = canvas.getByTitle(/Restablecer campo|Restablish field/i);

			expect(clearButton).toBeInTheDocument();
		});

		const clearButton = canvas.getByTitle(/Restablecer campo|Restablish field/i);

		// Click reset and verify it's cleared
		await userEvent.click(clearButton);
		expect(input).toHaveValue("");
	},
};

export const AsyncOptions: Story = {
	render: (args) => ({
		components: { SelectFilter },
		setup() {
			const model = ref<string | number>("betaLike");

			return { args, model, mockOptionsLoader };
		},
		template: '<SelectFilter v-bind="args" v-model="model" :options="mockOptionsLoader" />',
	}),
};

export default meta;
