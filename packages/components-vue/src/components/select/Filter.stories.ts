import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";

import type { iSelectOption } from "@open-xamu-co/ui-common-types";

import SelectFilter from "./Filter.vue";

const meta = {
	title: "Select/Select Filter",
	component: SelectFilter as Record<keyof typeof SelectFilter, unknown>,
	args: { options: ["Single option"] },
} satisfies Meta<typeof SelectFilter>;

type Story = StoryObj<typeof SelectFilter>;

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
};

export default meta;
