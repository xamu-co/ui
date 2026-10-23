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
	tags: ["test"],
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

export const WithAliases: Story = {
	render: (args) => ({
		components: { SelectFilter },
		setup() {
			const model = ref("");
			const options: iSelectOption[] = [
				{ value: "VAL_1", alias: "First Option" },
				{ value: "VAL_2", alias: "Second Option" },
			];

			return { args, model, options };
		},
		template: '<SelectFilter v-bind="args" v-model="model" :options="options" />',
	}),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole("combobox");

		expect(input).toBeInTheDocument();
		await userEvent.type(input, "First Option");
		expect(input).toHaveValue("First Option");
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

export const DisabledState: Story = {
	args: {
		disabled: true,
		placeholder: "Disabled filter",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole("combobox");

		expect(input).toBeDisabled();
	},
};

export const InvalidState: Story = {
	args: {
		invalid: true,
		placeholder: "Invalid filter",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole("combobox");

		expect(input).toHaveClass("is--invalid");
	},
};

export const WithIcon: Story = {
	args: {
		icon: "filter",
		placeholder: "Filter with icon",
	},
};

export default meta;
