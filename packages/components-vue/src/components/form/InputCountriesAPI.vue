<template>
	<FormInputNValues :key="states?.length" :model="model" :values="[1, 3]">
		<BaseWrapper
			v-slot="statesReq"
			:el="LoaderContentFetch"
			:wrap="!states && !!countryValue"
			:theme="theme"
			:promise="getCountryStates"
			:url="`/${model[0]}?states`"
			:payload="[countryValue]"
			unwrap
		>
			<LoaderContentFetch
				v-slot="citiesReq"
				:theme="theme"
				:prevent-autoload="!model[1]"
				:promise="!!model[1] && getStateCities"
				:url="`/${model[0]}/${model[1]}?cities`"
				:payload="[countryValue, model[1]]"
				:no-loader="statesReq.loading"
				:fallback="[]"
				ignore-errors
				unwrap
			>
				<slot v-bind="{ statesReq, citiesReq }"></slot>
			</LoaderContentFetch>
		</BaseWrapper>
	</FormInputNValues>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	import BaseWrapper from "../base/Wrapper.vue";
	import LoaderContentFetch from "../loader/ContentFetch.vue";
	// input helper components
	import FormInputNValues from "./InputNValues.vue";

	import type { iUseThemeProps } from "../../types/props";
	import type { iState } from "../../types/countries";
	import useCountries from "../../composables/countries";

	interface iFormInputCountriesApi extends iUseThemeProps {
		model: string[];
		states?: iState[];
	}

	/**
	 * Require options
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputCountriesApi", inheritAttrs: true });

	const props = defineProps<iFormInputCountriesApi>();

	const { defaultCountry, getCountryStates, getStateCities } = useCountries();

	const countryValue = computed(() => props.model[0] || defaultCountry || "");
</script>
