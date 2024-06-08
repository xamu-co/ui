import { inject } from "vue";

import type { iPluginOptions, tOrder, tOrderBy } from "@open-xamu-co/ui-common-types";

export type tPropertyOrderFn = (a: [string, any], b: [string, any]) => -1 | 0 | 1;

export function useSortObject(data: Record<string, any>) {
	return Object.entries(data)
		.sort(useOrderProperty)
		.filter(([property]) => property !== "id");
}

export function isPlainValue(value: any) {
	return ["string", "number", "boolean"].includes(typeof value);
}

export const useOrderProperty: tPropertyOrderFn = ([a, aValue], [b, bValue]) => {
	const isDateOrAuthor = (k: string) => k.endsWith("At") || k.endsWith("By");

	// Move dates or authors backwards
	if (isDateOrAuthor(a) || isDateOrAuthor(b)) {
		// Respect whatever order they had
		if (isDateOrAuthor(a) && isDateOrAuthor(b)) return 0;

		return isDateOrAuthor(a) ? 1 : -1;
	}
	// Move strings forward
	else if (isPlainValue(aValue) || isPlainValue(bValue)) {
		// Respect whatever order they had
		if (isPlainValue(aValue) && isPlainValue(bValue)) return 0;

		return isPlainValue(aValue) ? -1 : 1;
	}

	// Respect whatever order they had
	return 0;
};

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
