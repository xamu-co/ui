import type { Meta, StoryObj } from "@storybook/vue3";

import { FormInput } from "@open-xamu-co/ui-common-helpers";
import { eFormType } from "@open-xamu-co/ui-common-enums";

import FormSimpleComponent from "./Simple.vue";

const inputs: FormInput[] = [
	new FormInput({
		values: [""],
		name: "firstName",
		required: true,
		title: "First Name",
		placeholder: "What is your first name?",
		autocomplete: "name",
		icon: "user",
	}),
	new FormInput({
		placeholder: "E.g. Blue",
		title: "Possible Value",
		icon: ["industry", {}],
		name: "offerFieldValues",
		multiple: true,
	}),
	new FormInput({
		required: true,
		options: [{ value: 1, alias: "Payment on Delivery" }],
		type: eFormType.SELECT_FILTER,
		placeholder: "Search payment methods",
		icon: "credit-card",
		autocomplete: "off",
		name: "paymentMethodIds",
		multiple: true,
		min: 0,
		title: "Choose one or several payment methods",
	}),
	new FormInput({
		options: [
			{ value: "Happy", icon: "face-smile" },
			{ value: "Tired", icon: "face-tired" },
			{ value: "Sad", icon: "face-sad-tear" },
			{ value: "indiferent", icon: "face-meh" },
			{ value: "In love", icon: "face-grin-hearts" },
		],
		type: eFormType.CHOICE,
		values: [""],
		name: "feeling",
		title: "How you feeling today?",
	}),
	new FormInput({
		type: eFormType.BOOLEAN,
		placeholder: "Users can skip this field when creating an offer",
		name: "nullable",
		title: "Is this field optional in the offer?",
	}),
	new FormInput({
		name: "logo",
		type: eFormType.FILE,
		title: "Business logo",
		max: 3,
	}),
];

const meta: Meta = {
	title: "Form/Form Simple",
	component: FormSimpleComponent as any,
	args: { modelValue: inputs },
};

type Story = StoryObj<typeof meta>;

export const Form: Story = {
	args: { modelValue: inputs },
};

export const FormUsingLocationField: Story = {
	args: {
		modelValue: [
			new FormInput({
				values: [["", "", ""]],
				name: "location",
				type: eFormType.LOCATION,
				required: true,
			}),
		],
	},
};

export const FormUsingPhoneField: Story = {
	args: {
		modelValue: [
			new FormInput({
				values: [["CO+57", ""]],
				name: "cellphone",
				required: true,
				type: eFormType.CELLPHONE,
			}),
		],
	},
};

export default meta;
