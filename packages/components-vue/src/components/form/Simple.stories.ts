import type { Meta, StoryObj } from "@storybook/vue3";

import Simple from "./Simple.vue";
import { FormInput } from "@open-xamu-co/ui-common-helpers";
import { eFormType } from "@open-xamu-co/ui-common-enums";

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
		values: [""],
		name: "lastName",
		required: true,
		title: "Last Name",
		placeholder: "What is your last name?",
		autocomplete: "family-name",
		icon: "user-group",
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
		title: "Choose one or several payment methods",
	}),
	new FormInput({
		values: [["", "", ""]],
		name: "location",
		type: eFormType.LOCATION,
		required: true,
	}),
	new FormInput({
		values: [["CO+57", ""]],
		name: "cellphone",
		required: true,
		type: eFormType.CELLPHONE,
	}),

	// new FormInput({ value:"",name: "identification", type: eFormTypeSimple.ID }),
];

const meta = {
	title: "Form/Form Simple",
	component: Simple as Record<keyof typeof Simple, unknown>,
	args: { modelValue: inputs },
} satisfies Meta<typeof Simple>;

type Story = StoryObj<typeof Simple>;

export const Sample: Story = {
	args: { modelValue: inputs },
};

export default meta;
