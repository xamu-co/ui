import type { Meta, StoryObj } from "@storybook/vue3";

import type { iSelectOption } from "@open-xamu-co/ui-common-types";

import Filter from "./Filter.vue";

const options: iSelectOption[] = [
	{ value: "TITLE" },
	{ value: "LONG_TEXT" },
	{ value: "SHORT_TEXT" },
	{ value: "ROW_NUMBER_VALUE" },
	{ value: "ROW_TEXT_VALUE" },
];

const meta = {
	title: "Select/Select Filter",
	component: Filter as Record<keyof typeof Filter, unknown>,
	args: { options },
} satisfies Meta<typeof Filter>;

type Story = StoryObj<typeof Filter>;

export const Sample: Story = {
	args: { options },
};

export default meta;
