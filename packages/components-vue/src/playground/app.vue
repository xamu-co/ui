<template>
	<div class="view">
		<div class="view-item">
			<div class="holder flx --flxColumn --flx-center-start --gap-30">
				<h1 class="--txtColor">Vue components playground</h1>
				<div class="txt --gaping-none">
					<p><b>Test your vue components here</b></p>
					<p class="--txtSize-sm --txtColor-dark5">
						Also please remember to not version anything within this playground
					</p>
				</div>
				<XamuActionButtonLink @click="count">{{ text }}</XamuActionButtonLink>
				<div class="--maxWidth-440">
					<XamuForm v-model="instanceInputs" v-model:invalid="invalid" :readonly="true" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { markRaw, ref } from "vue";

	import type { iInvalidInput } from "@open-xamu-co/ui-common-types";
	import { eFormType } from "@open-xamu-co/ui-common-enums";
	import { FormInput } from "@open-xamu-co/ui-common-helpers";

	const counter = ref(0);
	const text = ref("This is a button link component");
	const invalid = ref<iInvalidInput[]>([]);
	const instanceInputs = ref(
		markRaw(
			useInstanceInputs({
				address: "Cerca de ti",
				facebookId: "",
				twitterId: "",
				instagramId: "mardegea.sw",
				whatsappNumber: "3027026662",
				slogan: "Somos mar de gea",
				locationCity: "Cali",
				locationCountry: "CO",
				banner: { url: "", message: "25% de descuento en tu segunda compra" },
				url: "http://localhost:3000",
				name: "Mar de Gea Dev",
				whatsappIndicative: "CO+57",
				tiktokId: "",
				locationState: "VAC",
			})
		)
	);

	function count() {
		counter.value++;

		alert(`You clicked ${counter.value} times`);
	}

	interface Instance {
		// details
		name?: string;
		url?: string;
		slogan?: string;
		banner?: { message?: string; url?: string };
		// location
		locationCity?: string;
		locationState?: string;
		locationCountry?: string;
		address?: string;
		// contact
		whatsappNumber?: string;
		whatsappIndicative?: `${string}+${number}`;
		// socials
		tiktokId?: string;
		twitterId?: string;
		instagramId?: string;
		facebookId?: string;
	}

	function useInstanceInputs(instance: Instance = {}): FormInput[] {
		return [
			new FormInput({
				values: [[instance?.whatsappIndicative || "", instance?.whatsappNumber || ""]],
				name: "whatsapp",
				title: "Whatsapp",
				placeholder: "Whatsapp de la tienda",
				icon: ["whatsapp", { brand: true }],
				type: eFormType.CELLPHONE,
			}),
			new FormInput({
				values: [
					[
						instance?.locationCountry || "",
						instance?.locationState || "",
						instance?.locationCity || "",
					],
				],
				name: "location",
				title: "Ciudad",
				placeholder: "Ciudad de la tienda",
				icon: ["city", { brand: true }],
				type: eFormType.LOCATION,
			}),
		];
	}
</script>

<style>
	#appex {
		min-height: 100%;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.view {
		width: 100%;
	}
</style>
