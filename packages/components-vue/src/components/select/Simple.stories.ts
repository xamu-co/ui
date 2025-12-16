import type { Meta, StoryObj } from "@storybook/vue3-vite";

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
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { options },
};

export default meta;
