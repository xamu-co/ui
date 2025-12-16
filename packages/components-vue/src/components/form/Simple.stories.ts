import type { StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import type { iInvalidInput, tFormInput } from "@open-xamu-co/ui-common-types";
import { FormInput, useForm } from "@open-xamu-co/ui-common-helpers";
import { eFormType } from "@open-xamu-co/ui-common-enums";

import type { GenericMeta } from "../../types/storybook";

import FormSimple from "./Simple.vue";
import ActionButton from "../action/Button.vue";

const meta = {
	title: "Form/Form Simple",
	component: FormSimple,
	args: {},
} satisfies GenericMeta<typeof FormSimple>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
};

export const WithInputs: Story = {
	render: (args) => ({
		components: { FormSimple },
		setup() {
			const inputs: tFormInput[] = [
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
			const invalid = ref<iInvalidInput[]>([]);

			return { args, inputs, invalid };
		},
		template: `<FormSimple v-bind="args" v-model="inputs" v-model:invalid="invalid" />`,
	}),
	args: {},
};

export const WithLocationField: Story = {
	render: (args) => ({
		components: { FormSimple, ActionButton },
		setup() {
			const { getResponse } = useForm();
			const inputs = ref<tFormInput[]>([
				new FormInput({
					values: [["CO", "", ""]],
					name: "location",
					type: eFormType.LOCATION,
					required: true,
				}),
			]);
			const invalid = ref<iInvalidInput[]>([]);

			interface iLocation {
				locationCountry: string;
				locationState: string;
				locationCity: string;
			}

			async function checkLocation(event: Event) {
				const { response, invalidInputs, withErrors, validationHadErrors, errors } =
					await getResponse<iLocation, iLocation>(
						async (data) => ({ data }),
						inputs.value,
						event
					);

				invalid.value = invalidInputs;

				if (!withErrors) {
					// Succesful request
					alert("Success");
					console.log(response);
				} else if (!validationHadErrors) {
					if (!response && !errors) {
						alert("Sin cambios");
					} else {
						alert("Error");
					}
				}
			}

			return { args, inputs, invalid, checkLocation };
		},
		template: `
			<div class="flx --flxColumn --flx-start-stretch --gap-30">
				<FormSimple v-bind="args" v-model="inputs" v-model:invalid="invalid" />
				<ActionButton @click="checkLocation">Check location</ActionButton>
			</div>
		`,
	}),
};

export const WithPhoneField: Story = {
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

export const Make: Story = {
	render: (args) => ({
		components: { FormSimple },
		setup() {
			const inputs = ref<tFormInput[]>([]);
			const invalid = ref<iInvalidInput[]>([]);
			const sampleInstance = {
				locationState: "VAC",
				locationCity: "Cali",
				whatsappIndicative: "CO+57",
				updatedAt: "2024-10-08T15:27:58.220",
				address: "",
				slogan: "We are yours",
				banner: { message: "10% off", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
				locationCountry: "CO",
				createdAt: "2024-09-19T18:47:20.000",
				whatsappNumber: "0000000000",
				name: "Superstore",
				id: "localhost",
			};

			function makeInstanceInputs(instance: typeof sampleInstance): tFormInput[] {
				return [
					new FormInput({
						values: [instance?.name || ""],
						name: "name",
						required: true,
						title: "Nombre de la tienda",
						placeholder: "Ej: Mi tienda",
						icon: "store",
					}),
					new FormInput({
						values: [instance?.slogan || ""],
						name: "slogan",
						title: "Eslogan de la tienda",
						placeholder: "Ej: La tienda cerca de ti",
						icon: "flag",
					}),
					new FormInput({
						values: [
							[instance?.whatsappIndicative || "", instance?.whatsappNumber || ""],
						],
						name: "whatsapp",
						title: "Whatsapp",
						placeholder: "Whatsapp de la tienda",
						icon: ["whatsapp", { brand: true }],
						type: eFormType.CELLPHONE,
					}),
					new FormInput({
						values: [
							["co", instance?.locationState || "", instance?.locationCity || ""],
						],
						name: "location",
						title: "Ubicacion",
						placeholder: "Ubicacion de la tienda",
						icon: "city",
						type: eFormType.LOCATION,
					}),
					new FormInput({
						values: [instance?.address || ""],
						name: "address",
						title: "Direccion",
						placeholder: "Ej: Cra 123 #45-67 Sur",
						icon: "location-dot",
					}),
				];
			}

			return { args, inputs, invalid, sampleInstance, makeInstanceInputs };
		},
		template: `
			<FormSimple 
				v-bind="args"
				v-model="inputs"
				v-model:invalid="invalid"
				:make="makeInstanceInputs"
				:payload="[sampleInstance]"
			/>
		`,
	}),
	args: {},
};

export default meta;
