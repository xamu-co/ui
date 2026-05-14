import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import { FormInput } from "@open-xamu-co/ui-common-helpers";
import { eFormType } from "@open-xamu-co/ui-common-enums";

import FormInputComponent from "./Input.vue";
import { mockOptionsLoader } from "../select/Filter.stories";

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

export const AsyncOptions: Story = {
	render: (args) => ({
		components: { FormInputComponent },
		setup() {
			const model = ref<string[]>([""]);

			return { args, model };
		},
		template: '<FormInputComponent v-bind="args" v-model="model" />',
	}),
	args: {
		input: new FormInput({
			name: "asyncOptions",
			type: eFormType.SELECT_FILTER,
			options: mockOptionsLoader,
		}),
	},
};

export default meta;
