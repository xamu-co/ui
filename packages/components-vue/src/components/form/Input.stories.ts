import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { FormInput } from "@open-xamu-co/ui-common-helpers";

import FormInputComponent from "./Input.vue";

const nameInput = new FormInput({
	name: "name",
	required: true,
	title: "Name",
	placeholder: "What is your name?",
	icon: "user",
});

const meta = {
	title: "Form/Form Input",
	component: FormInputComponent,
	args: { modelValue: [""], input: nameInput },
} satisfies Meta<typeof FormInputComponent>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { modelValue: [""], input: nameInput },
};

export default meta;
