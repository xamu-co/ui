import type { Meta, StoryObj } from "@storybook/vue3";

import { FormInput } from "@open-xamu-co/ui-common-helpers";

import Input from "./Input.vue";

const nameInput = new FormInput({
	name: "name",
	required: true,
	title: "Name",
	placeholder: "What is your name?",
	icon: "user",
});

const meta = {
	title: "Form/Form Input",
	component: Input as Record<keyof typeof Input, unknown>,
	args: { modelValue: [""], input: nameInput },
} satisfies Meta<typeof Input>;

type Story = StoryObj<typeof Input>;

export const Sample: Story = {
	args: { modelValue: [""], input: nameInput },
};

export default meta;
