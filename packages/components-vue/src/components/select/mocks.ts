import type { iFormOption } from "@open-xamu-co/ui-common-types";

const allOptions: iFormOption[] = [
	{ value: "alpha", alias: "Alpha" },
	{ value: "beta", alias: "Beta" },
	{ value: "betaLike", alias: "Beta Like" },
	{ value: "gamma", alias: "Gamma" },
];

/** Emulate async options loader */
export async function mockOptionsLoader(query?: string | number): Promise<iFormOption[]> {
	await new Promise((r) => setTimeout(r, 200));

	const q = String(query ?? "")
		.trim()
		.toLowerCase();

	if (!q) return allOptions;

	return allOptions.filter(
		(o) =>
			String(o.value).toLowerCase().includes(q) ||
			String(o.alias ?? o.value)
				.toLowerCase()
				.includes(q)
	);
}
