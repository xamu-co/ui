import { inject } from "vue";

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

export function useSortObject(data: Record<string, any>) {
	return Object.entries(data)
		.sort(([a], [b]) => {
			// updatedAt, updatedBy, createdAt and createdBy to last position
			if (a.endsWith("At") || a.endsWith("By") || b.endsWith("At") || b.endsWith("By")) {
				if (a.endsWith("At") || a.endsWith("By")) return 1;

				return -1;
			} else if (a > b) return 1;
			else if (a < b) return -1;

			return 0;
		})
		.filter(([property]) => property !== "id");
}

export function useHelpers<T>(helper: (o?: iPluginOptions) => T): ReturnType<typeof helper> {
	const xamuOptions = inject<iPluginOptions>("xamu");

	return helper(xamuOptions);
}
