import { setProjectAnnotations } from "@storybook/vue3-vite";
import * as projectAnnotations from "./preview";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([projectAnnotations]);

// Mock the countries API globally to prevent flaky tests due to network/instance spin downs
const originalFetch = window.fetch.bind(window);
window.fetch = async (url, options) => {
	const urlStr = typeof url === "string" ? url : (url as any).url || String(url);

	if (urlStr.includes("countries.xamu.com.co")) {
		if (urlStr.includes("/api/v1/CO/") || urlStr.includes("/CO/")) {
			// Cities
			return new Response(
				JSON.stringify({
					data: {
						cities: [{ value: "Cali", alias: "Cali" }],
					},
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } }
			);
		} else if (urlStr.includes("/api/v1/CO") || urlStr.includes("/CO")) {
			// States
			return new Response(
				JSON.stringify({
					data: {
						states: [{ value: "VAC", alias: "Valle del Cauca" }],
					},
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } }
			);
		} else {
			// Countries list
			return new Response(
				JSON.stringify({
					data: [{ code: "CO", name: "Colombia", indicative: "+57" }],
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } }
			);
		}
	}

	return originalFetch(url, options);
};
