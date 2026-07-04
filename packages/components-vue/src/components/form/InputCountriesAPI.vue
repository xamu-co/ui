<template>
	<suspense>
		<template #fallback><LoaderSimple :theme="theme" /></template>
		<BaseWrapper
			v-slot="statesReq"
			:wrapper="LoaderContentFetch"
			:wrap="!loading && !states?.length"
			:promise="getCountryStates"
			:url="`/${model[0]}?states`"
			:payload="[countryValue]"
			:fallback="[]"
			:theme="theme"
			unwrap
		>
			<suspense>
				<template #fallback><LoaderSimple :theme="theme" /></template>
				<BaseWrapper
					v-slot="citiesReq"
					:wrapper="LoaderContentFetch"
					:wrap="!loading && !statesReq?.loading && !!model[1]"
					:promise="getStateCities"
					:url="`/${model[0]}/${model[1]}?cities`"
					:payload="[countryValue, model[1]]"
					:fallback="[]"
					:theme="theme"
					unwrap
				>
					<slot v-bind="{ statesReq, citiesReq }"></slot>
				</BaseWrapper>
			</suspense>
		</BaseWrapper>
	</suspense>
</template>

<script setup lang="ts">
	import { computed, defineAsyncComponent } from "vue";

	import BaseWrapper from "../base/Wrapper.vue";
	import LoaderSimple from "../loader/Simple.vue";

	import type { iUseThemeProps } from "../../types/props";
	import type { iCountry, iState } from "../../types/countries";
	import useCountries from "../../composables/countries";

	const LoaderContentFetch = defineAsyncComponent({
		loader: () => import("../loader/ContentFetch.vue"),
		loadingComponent: LoaderSimple,
	});

	interface iFormInputCountriesApi extends iUseThemeProps {
		model: string[];
		countries?: iCountry[];
		states?: iState[];
		/** Loading countries and states */
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
