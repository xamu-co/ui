import type { Meta, StoryObj } from "@storybook/vue3";

import Stages from "./Stages.vue";
import { type iForm, FormInput, useForm } from "@open-xamu-co/ui-common-helpers";
import { eFormType } from "@open-xamu-co/ui-common-enums";
import type { iInvalidInput } from "@open-xamu-co/ui-common-types";

const stages: iForm[][] = [
	[
		{
			title: "Offer field",
			inputs: [
				new FormInput({
					required: true,
					placeholder: "E.g. Samsung",
					icon: ["industry", {}],
					name: "name",
					title: "Field Name",
				}),
				new FormInput({
					required: true,
					type: eFormType.LONGTEXT,
					placeholder: "E.g. Nokia",
					name: "description",
					title: "Description of the Field",
				}),
				new FormInput({
					type: eFormType.BOOLEAN,
					placeholder: "Users can skip this field when creating an offer",
					name: "nullable",
					title: "Is this field optional in the offer?",
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
			],
		},
		{
			title: "UI component",
			inputs: [
				new FormInput({
					options: [
						{ value: "TITLE" },
						{ value: "LONG_TEXT" },
						{ value: "SHORT_TEXT" },
						{ value: "ROW_NUMBER_VALUE" },
						{ value: "ROW_TEXT_VALUE" },
					],
					type: eFormType.CHOICE,
					values: ["ROW_TEXT_VALUE"],
					name: "uiComponent",
					title: "UI Component of the Field",
				}),
			],
			listen: true,
		},
	],
	[
		{
			title: "Children",
			inputs: [
				new FormInput({
					type: eFormType.SELECT_FILTER,
					placeholder: "Search offer fields",
					title: "Choose offer fields",
					icon: ["align-left", {}],
					name: "offerFieldChildrenIds",
					multiple: true,
				}),
			],
		},
		{
			title: "Offer field values",
			inputs: [
				new FormInput({
					placeholder: "E.g. Blue",
					title: "Possible Value",
					icon: ["industry", {}],
					name: "offerFieldValues",
					multiple: true,
				}),
			],
		},
	],
];

async function submitFn(inputs: FormInput[]): Promise<boolean | iInvalidInput[]> {
	const { utils } = useForm();

	console.log(utils.getFormValues(inputs));

	return true;
}

const meta = {
	title: "Form/Form Stages",
	component: Stages,
	args: { stages, submitFn },
} satisfies Meta<typeof Stages>;

type Story = StoryObj<typeof Stages>;

export const Sample: Story = {
	args: { stages, submitFn },
};

export default meta;
