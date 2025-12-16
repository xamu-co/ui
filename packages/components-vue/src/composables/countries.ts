import type { iCity, iCountry, iState } from "../types/countries";
import useFetchUtils from "./fetch";
import { useHelpers } from "./utils";

/**
 * Countries composable
 *
 * @composable
 */
export default function useCountries() {
	return useHelpers(({ country: defaultCountry, countriesUrl }) => {
		const { useFetch } = useFetchUtils();

		const fallbackCountry = {} as iCountry & { states?: iState[] };

		async function getCountries() {
			const { data, error } = await useFetch<{ data: iCountry[]; error: string }>(
				countriesUrl
			);

			if (error) throw new Error(error);

			return data;
		}

		async function getCountry(country: string): Promise<iCountry & { states: iState[] }> {
			if (!country) throw new Error("A valid country is required");

			const { data, error } = await useFetch<{
				data: iCountry & { states: iState[] };
				error: string;
			}>(`${countriesUrl}/${country}`, { states: "" });

			if (error) throw new Error(error);

			return data;
		}

		async function getCountryStates(country: string): Promise<iState[]> {
			return (await getCountry(country)).states;
		}

		async function getState(
			country: string,
			state: string
		): Promise<iState & { cities: iCity[] }> {
			if (!country || !state) throw new Error("A valid country and state are required");

			const { data, error } = await useFetch<{
				data: iState & { cities: iCity[] };
				error: string;
			}>(`${countriesUrl}/${country}/${state}`, { cities: "" });

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
	});
}
