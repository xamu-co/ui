import template from "lodash-es/template";
import get from "lodash-es/get";
import trim from "lodash-es/trim";
import has from "lodash-es/has";

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

interface iUseI18n<L extends Record<string, string | Record<string, string>>> {
	/**
	 * Interpolates localized text
	 *
	 * @param key key to the text to interpolate. Ex: "hello_name" => "Hello {name}!"
	 * @param data Optional number or variables to interpolate into text
	 * @returns {string}
	 */
	t: <K extends string & keyof L, Ko extends L[K], KA extends string & keyof Ko>(
		key: Ko extends string ? K : `${K}.${KA}`,
		data?: number | { [key: string]: unknown; count?: number },
		fallback?: string
	) => string;
	/**
	 * Checks if the interpolation key exist
	 *
	 * @param key interpolation key to check
	 * @returns {boolean} true if the key exists
	 */
	te: <K extends string & keyof L, Ko extends L[K], KA extends string & keyof Ko>(
		key: string
	) => key is Ko extends string ? K : `${K}.${KA}`;
	/**
	 * Returns translation if key exist
	 * @param key interpolation key to check
	 * @returns {string}
	 */
	tet: (key: string) => string;
}

/**
 * I18n Composable
 *
 * @composable
 */
export default function useI18n<L extends Record<string, string | Record<string, string>>>(
	options: iPluginOptions & { locale?: L } = {}
): iUseI18n<L> {
	return {
		t<K extends string & keyof L, Ko extends L[K], KA extends string & keyof Ko>(
			key: Ko extends string ? K : `${K}.${KA}`,
			data: number | { [key: string]: unknown; count?: number } = {},
			fallback = `No locale for "${key}" provided`
		): string {
			// Empty string string if locale doesn't exist
			let locale = get(options.locale || {}, key, fallback);
			const interpolate = /\{(.+?)\}/g;
			const plurals = locale.split("|");
			const count = typeof data === "number" ? data : (data?.count ?? -1);

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

			const compile = template(trim(locale), { interpolate });

			return compile(typeof data === "number" ? { count } : data);
		},
		te<K extends string & keyof L, Ko extends L[K], KA extends string & keyof Ko>(
			key: string
		): key is Ko extends string ? K : `${K}.${KA}` {
			return has(options.locale || {}, key);
		},
		tet(key: string): string {
			return (this.te(key) && this.t(key)) || key;
		},
	};
}
