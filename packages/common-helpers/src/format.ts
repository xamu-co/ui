import type { iSelectOption } from "@open-xamu-co/ui-common-types";

/**
 * create iSelectOption from compatible values
 */
export function toSelectOption<T extends iSelectOption = iSelectOption>(
	option: string | number | T
): iSelectOption | T {
	if (typeof option === "object" && option !== null) return option;

	return { value: option };
}

/**
 * Retorna el numero dado con formato de puntos de mil
 *
 * @export
 * @param {number} x a interger
 * @returns {string} the same interger but parsed as a dotted number
 */
export function formatAsCurrency(x: number): string {
	x = parseFloat(x.toString());

	// return parseFloat(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Get localized time ago string
 * @param date
 * @param locale
 * @returns
 */
export function timeAgo(date: Date, locale = "en-US") {
	const difference = (new Date().getTime() - date.getTime()) / 1000;
	const minutes = Math.floor(difference / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(months / 12);
	const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

	if (years > 0) return relative.format(0 - years, "year");
	else if (months > 0) return relative.format(0 - months, "month");
	else if (days > 0) return relative.format(0 - days, "day");
	else if (hours > 0) return relative.format(0 - hours, "hour");
	else if (minutes > 0) return relative.format(0 - minutes, "minute");

	return relative.format(0 - difference, "second");
}
