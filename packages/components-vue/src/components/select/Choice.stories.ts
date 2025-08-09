import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";

import type { iSelectOption } from "@open-xamu-co/ui-common-types";

import SelectChoice from "./Choice.vue";

const meta = {
	title: "Select/Select Choice",
	component: SelectChoice as Record<keyof typeof SelectChoice, unknown>,
	args: { options: ["Single option"] },
} satisfies Meta<typeof SelectChoice>;

type Story = StoryObj<typeof SelectChoice>;

export const Sample: Story = {
	args: {},
};

export const WithOptions: Story = {
	render: (args) => ({
		components: { SelectChoice },
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
		template: '<Choice v-bind="args" v-model="model" :options="options" />',
	}),
};

export const WithMultipleOptions: Story = {
	...WithOptions,
	args: { multiple: true },
};

export default meta;
