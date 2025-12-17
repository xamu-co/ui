import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import type { iSelectOption } from "@open-xamu-co/ui-common-types";

import SelectFilter from "./Filter.vue";

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
};

export default meta;
