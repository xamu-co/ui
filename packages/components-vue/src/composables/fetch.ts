import { useHelpers } from "./utils";

/**
 * Fetch composable
 *
 * @composable
 */
export default function useFetchUtils() {
	return useHelpers(({ lang, internals: { ofetch } = {} }) => {
		function withUrlParams(url: string, params: Record<string, string> = {}) {
			const urlParams = new URLSearchParams({
				...params,
				...(lang && lang !== "en" ? { lang } : {}),
			});

			return `${url.split("?")[0]}?${urlParams}`;
		}

		async function useFetch<T>(url: string, params: Record<string, string> = {}): Promise<T> {
			url = withUrlParams(url, params);

			if (ofetch) return ofetch(url, { cache: "force-cache" });

			// Fallback to default fetch
			return (await fetch(url, { cache: "force-cache" })).json();
		}

		return { withUrlParams, useFetch };
	});
}
