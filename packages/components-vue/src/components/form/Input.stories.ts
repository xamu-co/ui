import type { Meta, StoryObj } from "@storybook/vue3";

import { FormInput } from "@open-xamu-co/ui-common-helpers";

import FormInputComponent from "./Input.vue";

const nameInput = new FormInput({
	name: "name",
	required: true,
	title: "Name",
	placeholder: "What is your name?",
	icon: "user",
});

const meta: Meta = {
	title: "Form/Form Input",
	component: FormInputComponent,
	args: { modelValue: [""], input: nameInput },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { modelValue: [""], input: nameInput },
};

export default meta;
