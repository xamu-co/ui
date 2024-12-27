<template>
	<FormInputNValues
		:key="states?.length"
		v-bind="{ model, loading, errors, refresh }"
		:content="!!countries?.length"
		:values="[1, 3]"
	>
		<BaseWrapper
			v-slot="statesReq"
			:wrapper="LoaderContentFetch"
			:wrap="!loading && !states && !!countryValue"
			:theme="theme"
			:promise="getCountryStates"
			:url="`/${model[0]}?states`"
			:payload="[countryValue]"
			:fallback="[]"
			unwrap
		>
			<LoaderContentFetch
				v-slot="citiesReq"
				:theme="theme"
				:prevent-autoload="!model[1]"
				:no-loader="statesReq?.loading"
				:promise="getStateCities"
				:url="`/${model[0]}/${model[1]}?cities`"
				:payload="[countryValue, model[1]]"
				:fallback="[]"
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
	import type { iCountry, iState } from "../../types/countries";
	import useCountries from "../../composables/countries";

	interface iFormInputCountriesApi extends iUseThemeProps {
		model: string[];
		countries?: iCountry[];
		states?: iState[];
		loading?: boolean;
		errors?: unknown;
		refresh?: (...args: any[]) => any;
	}

	/**
	 * Require options
	 *
	 * @component
	 */

	defineOptions({ name: "FormInputCountriesApi", inheritAttrs: true });

	const props = withDefaults(defineProps<iFormInputCountriesApi>(), { states: () => [] });

	const { defaultCountry, getCountryStates, getStateCities } = useCountries();

	const countryValue = computed(() => props.model[0] || defaultCountry || "");
</script>
