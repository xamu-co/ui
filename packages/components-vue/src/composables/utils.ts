import { inject } from "vue";

import type { tOrder, tOrderBy } from "@open-xamu-co/ui-common-types";

import type { iVuePluginOptions } from "../plugin";

export function useHelpers<T = any>(
	helper: (o: iVuePluginOptions & { countriesUrl: string }) => T
): T {
	const { countriesUrl = "https://countries.xamu.com.co/api/v1", ...xo } =
		inject<iVuePluginOptions>("xamu") || {};

	return helper({ ...xo, countriesUrl });
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
