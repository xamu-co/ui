import type { tPropertyOrderFn } from "@open-xamu-co/ui-common-types";

export function useSortObject(data: Record<string, any>) {
	return Object.entries(data)
		.sort(useOrderProperty)
		.filter(([property]) => property !== "id");
}

export function isPlainValue(value: any) {
	return ["string", "number", "boolean"].includes(typeof value);
}

/**
 * Orders properties
 *
 * Move dates to the end, strings forward and leave everyting else in place
 */
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
