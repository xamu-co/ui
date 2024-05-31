import { inject } from "vue";

import type { iPluginOptions, tOrder, tOrderBy } from "@open-xamu-co/ui-common-types";

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

export function useOrderBy(orderByParam: any): tOrderBy[] {
	function getOrderBy(bys: string[]) {
		return bys
			.map((by): tOrderBy | false => {
				if (typeof by !== "string") return false;

				const splitBy = by.split(":", 2);
				const order: tOrder = splitBy[1]?.toLowerCase?.() === "asc" ? "asc" : "desc";

				return [splitBy[0], order];
			})
			.filter((by): by is tOrderBy => !!by);
	}

	const routeOrderBy: string | string[] = orderByParam;

	if (Array.isArray(routeOrderBy)) {
		return getOrderBy(routeOrderBy);
	} else if (typeof routeOrderBy === "string") {
		return getOrderBy([routeOrderBy]);
	}

	return [];
}
