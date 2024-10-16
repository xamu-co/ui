<template>
	<div class="--maxWidth-440">
		<Form v-model="instanceInputs" v-model:invalid="invalid" />
	</div>
</template>

<script setup lang="ts">
	import { markRaw, ref } from "vue";
	import { FormInput } from "@open-xamu-co/ui-common-helpers";
	import { eFormType } from "@open-xamu-co/ui-common-enums";
	import type { iInvalidInput } from "@open-xamu-co/ui-common-types";

	import Form from "../components/form/Simple.vue";

	/**
	 * Form with fetch
	 *
	 * @screen
	 */

	const invalid = ref<iInvalidInput[]>([]);
	const instanceInputs = ref(markRaw(useInstanceInputs()));

	function useInstanceInputs(): FormInput[] {
		const instance = {
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
				values: [[instance?.whatsappIndicative || "", instance?.whatsappNumber || ""]],
				name: "whatsapp",
				title: "Whatsapp",
				placeholder: "Whatsapp de la tienda",
				icon: ["whatsapp", { brand: true }],
				type: eFormType.CELLPHONE,
			}),
			new FormInput({
				values: [["co", instance?.locationState || "", instance?.locationCity || ""]],
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
</script>
