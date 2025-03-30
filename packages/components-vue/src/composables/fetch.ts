import { inject } from "vue";

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

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

	return { withUrlParams };
}
