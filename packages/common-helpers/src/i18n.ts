import _ from "lodash";

import type { iPluginOptions, tPluginLocaleKey } from "@open-xamu-co/ui-common-types";

/**
 * I18n Composable
 *
 * @composable
 */
export default function useI18n(options: iPluginOptions = {}) {
	/**
	 * Interpolates localized text
	 *
	 * @param key key to the text to interpolate. Ex: "hello_name" => "Hello {name}!"
	 * @param data Optional number or variables to interpolate into text
	 * @returns {string}
	 */
	function t(
		key: tPluginLocaleKey,
		data: number | { [key: string]: unknown; count?: number } = {},
		fallback = `No locale for "${key}" provided`
	): string {
		// Empty string string if locale doesn't exist
		let locale = _.get(options.locale || {}, key, fallback);
		const interpolate = /\{(.+?)\}/g;
		const plurals = locale.split("|");
		const count = typeof data === "number" ? data : data?.count ?? -1;

		// Pluralization
		if (count > -1 && plurals.length > 1) {
			if (plurals.length === 2) {
				// product, products
				locale = plurals[count > 1 ? 1 : 0];
			} else if (plurals.length === 3) {
				// no products, a product, products
				locale = plurals[count ? (count > 1 ? 2 : 1) : 0];
			}
		}

		const compile = _.template(_.trim(locale), { interpolate });

		return compile(typeof data === "number" ? { count } : data);
	}

	/**
	 * Checks if the interpolation key exist
	 *
	 * @param key interpolation key to check
	 * @returns {boolean} true if the key exists
	 */
	function te(key: string): key is tPluginLocaleKey {
		return _.has(options.locale || {}, key);
	}

	/**
	 * Returns translation if key exist
	 * @param key interpolation key to check
	 * @returns {string}
	 */
	function tet(key: string): string {
		return (te(key) && t(key)) || key;
	}

	return {
		t,
		te,
		tet,
	};
}
