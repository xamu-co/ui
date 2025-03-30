import type { iFormOption, iSelectOption } from "@open-xamu-co/ui-common-types";

/**
 * create iSelectOption or iFormOption from compatible values
 */
export function toOption<T extends iSelectOption | iFormOption = iSelectOption>(
	option: string | number | T
): T extends iFormOption ? iFormOption : iSelectOption {
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
 *
 * Uses Intl js api
 * @param date
 * @param locale
 * @returns
 */
export function timeAgo(date: Date, locale = "en-US") {
	/** Difference in seconds */
	const difference = (new Date().getTime() - date.getTime()) / 1000;
	const minutes = difference / 60;
	const hours = minutes / 60;
	const days = hours / 24;
	const months = days / 30;
	const years = months / 12;
	const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
	// Use absolute value before rounding
	const moreThan = (v: number) => Math.floor(Math.abs(v)) > 0;

	if (moreThan(years)) return relative.format(0 - Math.floor(years), "year");
	else if (moreThan(months)) return relative.format(0 - Math.floor(months), "month");
	else if (moreThan(days)) return relative.format(0 - Math.floor(days), "day");
	else if (moreThan(hours)) return relative.format(0 - Math.floor(hours), "hour");
	else if (moreThan(minutes)) return relative.format(0 - Math.floor(minutes), "minute");

	return relative.format(0 - difference, "second");
}
