import type { Meta, StoryObj } from "@storybook/vue3";

import type { iSelectOption } from "@open-xamu-co/ui-common-types";

import Choice from "./Choice.vue";

const options: iSelectOption[] = [
	{ value: "TITLE" },
	{ value: "LONG_TEXT" },
	{ value: "SHORT_TEXT" },
	{ value: "ROW_NUMBER_VALUE" },
	{ value: "ROW_TEXT_VALUE" },
];

const meta = {
	title: "Select/Select Choice",
	component: Choice as Record<keyof typeof Choice, unknown>,
	args: { options },
} satisfies Meta<typeof Choice>;

type Story = StoryObj<typeof Choice>;

export const Sample: Story = {
	args: { options },
};

export default meta;
