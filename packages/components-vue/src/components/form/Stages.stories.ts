import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, userEvent, expect, waitFor } from "storybook/test";

import { FormInput, useForm } from "@open-xamu-co/ui-common-helpers";
import { eFormType } from "@open-xamu-co/ui-common-enums";
import type { iForm, iInvalidInput, tFormInput } from "@open-xamu-co/ui-common-types";

import FormStages from "./Stages.vue";

const meta: Meta<typeof FormStages> = {
	title: "Form/Form Stages",
	component: FormStages,
	args: {},
	excludeStories: /.*Data$/,
	tags: ["test"],
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { stages: [] },
};

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

async function submitFn(inputs: tFormInput[]): Promise<boolean | iInvalidInput[]> {
	const { utils } = useForm();

	const { values, invalidInputs } = utils.getFormValues(inputs);

	alert(JSON.stringify(values));

	if (invalidInputs.length) return invalidInputs;

	return true;
}

export const WithStages: Story = {
	args: { stages: stagesData, submitFn },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Stage 1 fields (wait for Suspense to resolve)
		const fieldNameInput = await waitFor(() => canvas.getByPlaceholderText("E.g. Samsung..."));

		expect(fieldNameInput).toBeInTheDocument();

		// Find Next button (Next / Siguiente)
		const nextButton = canvas.getByText(/Next|Siguiente/i);

		expect(nextButton).toBeInTheDocument();

		// Click Next
		await userEvent.click(nextButton);

		// Assert Stage 2 field is shown
		await waitFor(() => {
			const stage2Title = canvas.getByText(/UI Component of the Field|Componente de la UI/i);

			expect(stage2Title).toBeInTheDocument();
		});

		// Find Previous button (Previous / Anterior)
		const prevButton = canvas.getByText(/Previous|Anterior/i);

		expect(prevButton).toBeInTheDocument();

		// Click Previous
		await userEvent.click(prevButton);

		// Assert back on Stage 1
		await waitFor(() => {
			const fieldNameInputRebound = canvas.getByPlaceholderText("E.g. Samsung...");

			expect(fieldNameInputRebound).toBeInTheDocument();
		});
	},
};

export const WithInvalidStage: Story = {
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
