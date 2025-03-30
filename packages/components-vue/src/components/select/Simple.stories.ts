import type { Meta, StoryObj } from "@storybook/vue3";

import type { iSelectOption } from "@open-xamu-co/ui-common-types";

import Simple from "./Simple.vue";

const options: iSelectOption[] = [
	{ value: "TITLE" },
	{ value: "LONG_TEXT" },
	{ value: "SHORT_TEXT" },
	{ value: "ROW_NUMBER_VALUE" },
	{ value: "ROW_TEXT_VALUE" },
];
const meta = {
	title: "Select/Select Simple",
	component: Simple as Record<keyof typeof Simple, unknown>,
	args: { options },
} satisfies Meta<typeof Simple>;

type Story = StoryObj<typeof Simple>;

export const Sample: Story = {
	args: { options },
};

export default meta;
