import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { FormInput } from "@open-xamu-co/ui-common-helpers";

import FormInputComponent from "./Input.vue";
import { eFormType } from "@open-xamu-co/ui-common-enums";
import { ref } from "vue";

const nameInput = new FormInput({
	name: "name",
	required: true,
	title: "Name",
	placeholder: "What is your name?",
	icon: "user",
});

const meta: Meta<typeof FormInputComponent> = {
	title: "Form/Form Input",
	component: FormInputComponent,
	args: { modelValue: [""], input: nameInput },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { FormInputComponent },
		setup() {
			const model = ref<string[]>([""]);

			return { args, model };
		},
		template: '<FormInputComponent v-bind="args" v-model="model" />',
	}),
	args: {
		input: nameInput,
	},
};

export const Code: Story = {
	render: (args) => ({
		components: { FormInputComponent },
		setup() {
			const model = ref<string[]>([""]);

			return { args, model };
		},
		template: '<FormInputComponent v-bind="args" v-model="model" />',
	}),
	args: {
		input: new FormInput({ name: "code", type: eFormType.CODE }),
	},
};

export default meta;
