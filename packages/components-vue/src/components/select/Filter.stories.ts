import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import type { iFormOption, iSelectOption } from "@open-xamu-co/ui-common-types";

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

const allOptions: iFormOption[] = [
	{ value: "alpha", alias: "Alpha" },
	{ value: "beta", alias: "Beta" },
	{ value: "betaLike", alias: "Beta Like" },
	{ value: "gamma", alias: "Gamma" },
];

/** Emulate async options loader */
export async function mockOptionsLoader(query?: string | number): Promise<iFormOption[]> {
	await new Promise((r) => setTimeout(r, 200));

	const q = String(query ?? "")
		.trim()
		.toLowerCase();

	if (!q) return allOptions;

	return allOptions.filter(
		(o) =>
			String(o.value).toLowerCase().includes(q) ||
			String(o.alias ?? o.value)
				.toLowerCase()
				.includes(q)
	);
}

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
