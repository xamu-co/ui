import { inject } from "vue";

import type { iPluginOptions, tHydrate } from "@open-xamu-co/ui-common-types";

/**
 * Fetch composable
 *
 * @composable
 */
export default function useFetch() {
	const { lang } = inject<iPluginOptions>("xamu") || {};

	function withUrlParams(url: string, params: Record<string, string> = {}) {
		const urlParams = new URLSearchParams({
			...params,
			...(lang && lang !== "en" ? { lang } : {}),
		});

		return `${url.split("?")[0]}?${urlParams}`;
	}

	/**
	 * Omit hydrate fn
	 */
	function unHydrate<T, P extends unknown[]>(fn: (...p: P) => Promise<T>) {
		return (_hydrate: tHydrate<T>, ...args: P) => fn(...args);
	}

	return {
		withUrlParams,
		unHydrate,
	};
}
