import { inject } from "vue";

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

import type { iCity, iCountry, iState } from "../types/countries";
import useFetch from "./fetch";

/**
 * Countries composable
 *
 * @composable
 */
export default function useCountries() {
	const { country: defaultCountry, countriesUrl = "https://countries.xamu.com.co/api/v1" } =
		inject<iPluginOptions>("xamu") || {};
	const { withUrlParams } = useFetch();

	const fallbackCountry = {} as iCountry & { states?: iState[] };

	async function getCountries(): Promise<iCountry[]> {
		const url = withUrlParams(`${countriesUrl}`);
		const { data, error } = await (await fetch(url, { cache: "force-cache" })).json();

		if (error) throw new Error(error);

		return data;
	}

	async function getCountry(country: string): Promise<iCountry & { states: iState[] }> {
		if (!country) throw new Error("A valid country is required");

		const url = withUrlParams(`${countriesUrl}/${country}`, { states: "" });
		const { data, error } = await (await fetch(url, { cache: "force-cache" })).json();

		if (error) throw new Error(error);

		return data;
	}

	async function getCountryStates(country: string): Promise<iState[]> {
		return (await getCountry(country)).states;
	}

	async function getState(country: string, state: string): Promise<iState & { cities: iCity[] }> {
		if (!country || !state) throw new Error("A valid country and state are required");

		const url = withUrlParams(`${countriesUrl}/${country}/${state}`, { cities: "" });
		const { data, error } = await (await fetch(url, { cache: "force-cache" })).json();

		if (error) throw new Error(error);

		return data;
	}

	async function getStateCities(country: string, state: string) {
		return (await getState(country, state)).cities;
	}

	return {
		defaultCountry,
		countriesUrl,
		fallbackCountry,
		getCountries,
		getCountry,
		getCountryStates,
		getState,
		getStateCities,
	};
}
