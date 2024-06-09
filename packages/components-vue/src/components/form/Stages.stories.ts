import type { Meta, StoryObj } from "@storybook/vue3";

import { type iForm, FormInput, useForm } from "@open-xamu-co/ui-common-helpers";
import { eFormType } from "@open-xamu-co/ui-common-enums";
import type { iInvalidInput } from "@open-xamu-co/ui-common-types";

import StagesComponent from "./Stages.vue";

export const stagesData: iForm[][] = [
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
					options: [
						{ value: 1, alias: "Payment on Delivery" },
						{ value: 2, alias: "Paypal" },
						{ value: 3, alias: "Credit card" },
					],
					type: eFormType.SELECT_FILTER,
					placeholder: "Search payment method",
					icon: "credit-card",
					autocomplete: "off",
					name: "paymentMethodId",
					title: "Choose one payment method",
				}),
				new FormInput({
					required: true,
					multiple: true,
					options: [
						{ value: 1, alias: "Payment on Delivery" },
						{ value: 2, alias: "Paypal" },
						{ value: 3, alias: "Credit card" },
					],
					type: eFormType.CHOICE,
					placeholder: "Pick payment method",
					icon: "credit-card",
					autocomplete: "off",
					name: "paymentMethodId",
					title: "Choose one payment method",
				}),
			],
		},
	],
	[
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

	const { values, invalidInputs } = utils.getFormValues(inputs);

	alert(JSON.stringify(values));

	if (invalidInputs.length) return invalidInputs;

	return true;
}

const meta = {
	title: "Form/Form Stages",
	component: StagesComponent,
	args: { stages: stagesData, submitFn },
	excludeStories: /.*Data$/,
} satisfies Meta<typeof StagesComponent>;

type Story = StoryObj<typeof StagesComponent>;

export const Stages: Story = {
	args: { stages: stagesData, submitFn },
};

export const StagesWithInvalidStage: Story = {
	args: {
		stages: [
			[
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
			[
				{
					title: "Children",
					/**
					 * No valid inputs
					 */
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
			],
		],
		submitFn,
	},
};

export default meta;
