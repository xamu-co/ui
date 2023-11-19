import { inject } from "vue";

import type { iPluginOptions, tHydrate } from "@open-xamu-co/ui-common-types";

/**
 * Fetch composable
 *
 * @composable
 */
export default function useFetch() {
	const { lang } = inject<iPluginOptions>("xamu") || {};

	function getUrlParams(params: Record<string, string> = {}) {
		return new URLSearchParams({ ...params, ...(lang && lang !== "en" ? { lang } : {}) });
	}

	/**
	 * Omit hydrate fn
	 */
	function unHydrate<T, P extends unknown[]>(fn: (...p: P) => Promise<T>) {
		return (_hydrate: tHydrate<T>, ...args: P) => fn(...args);
	}

	return {
		getUrlParams,
		unHydrate,
	};
}
