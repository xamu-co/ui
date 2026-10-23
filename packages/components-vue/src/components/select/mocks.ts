import type { iFormOption } from "@open-xamu-co/ui-common-types";

const allOptions: iFormOption[] = [
	{ value: "alpha", alias: "Alpha" },
	{ value: "beta", alias: "Beta" },
	{ value: "betaLike", alias: "Beta Like" },
	{ value: "gamma", alias: "Gamma" },
];

/** Check if query characters exist sequentially in target (fuzzy match) */
function isFuzzyMatch(target: string, query: string): boolean {
	let qIdx = 0;

	for (let tIdx = 0; tIdx < target.length && qIdx < query.length; tIdx++) {
		if (target[tIdx] === query[qIdx]) qIdx++;
	}

	return qIdx === query.length;
}

/** Emulate async options loader */
export async function mockOptionsLoader(query?: string | number): Promise<iFormOption[]> {
	const q = String(query ?? "")
		.trim()
		.toLowerCase();

	if (!q) return Promise.resolve([]);

	return Promise.resolve(
		allOptions.filter(
			(o) =>
				isFuzzyMatch(String(o.value).toLowerCase(), q) ||
				isFuzzyMatch(String(o.alias ?? o.value).toLowerCase(), q)
		)
	);
}
