<template>
	<FormInputNValues :model="model" :values="[1, 3]">
		<LoaderContentFetch
			v-slot="statesReq"
			:theme="theme"
			:promise="!states && !!countryValue && unHydrate(getCountryStates)"
			:payload="[countryValue]"
			:fallback="[]"
			unwrap
		>
			<LoaderContentFetch
				v-slot="citiesReq"
				:theme="theme"
				:promise="
					!!(countryValue && model[0]) &&
					model[0] !== model[0] &&
					!!(statesReq.content.length || states) &&
					unHydrate(getStateCities)
				"
				:payload="[countryValue, model[1]]"
				:fallback="[]"
				unwrap
			>
				<slot v-bind="{ statesReq, citiesReq }"></slot>
			</LoaderContentFetch>
		</LoaderContentFetch>
	</FormInputNValues>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	import type { iSelectOption } from "@open-xamu-co/ui-common-types";

	import LoaderContentFetch from "../loader/ContentFetch.vue";
	// input helper components
	import FormInputNValues from "./InputNValues.vue";

	import type { iUseThemeProps } from "../../types/props";
	import useFetch from "../../composables/fetch";
	import useCountries from "../../composables/countries";

	interface iFormInputCountriesApi extends iUseThemeProps {
		model: string[];
		states?: iSelectOption[];
	}

	/**
	 * Require options
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputCountriesApi", inheritAttrs: true });

	const props = defineProps<iFormInputCountriesApi>();

	const { unHydrate } = useFetch();
	const { defaultCountry, getCountryStates, getStateCities } = useCountries();

	const countryValue = computed(() => props.model[0] || defaultCountry || "");
</script>
