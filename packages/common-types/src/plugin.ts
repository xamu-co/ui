import { componentNames } from "@open-xamu-co/ui-common-enums";

import type { tPluginLocale } from "./locale.js";
import type { SweetAlertOptions } from "sweetalert2";

export type tComponent = (typeof componentNames)[number];

export type tSupportedLangs =
	| "kr"
	| "pt"
	| "nl"
	| "hr"
	| "fa"
	| "de"
	| "es"
	| "en"
	| "fr"
	| "ja"
	| "it"
	| "cn"
	| "tr";

export interface iPluginOptions<ComponentType = unknown> {
	/**
	 * Use web components
	 *
	 * @default false
	 */
	webComponents?: boolean;
	/**
	 * Register all or specific components globally
	 *
	 * @default true
	 */
	globalComponents?: boolean | tComponent[];
	/**
	 * Components prefix
	 *
	 * @default "xamu"
	 * @example xamu-component-name or XamuComponentName
	 */
	componentPrefix?: string;
	/**
	 * Router component
	 * If a router is used this component is required for buttons to work
	 */
	routerComponent?: ComponentType | string;
	/**
	 * Image component
	 * Optional image optimization component
	 */
	imageComponent?: ComponentType | string;
	/**
	 * Host that contain images
	 * Treat the url within them as images
	 *
	 * @example ["lh3.googleusercontent.com"]
	 * */
	imageHosts?: string[];
	/**
	 * Locales language code
	 * @default en - English locale
	 *
	 * Used to localize external data
	 */
	lang?: tSupportedLangs;
	/**
	 * Global locale values
	 * @default en - English locale
	 *
	 * You can implement your own or find more locale at "@open-xamu-co/ui-common-helpers/locale"
	 */
	locale?: tPluginLocale;
	mediaQueryPixels?: {
		/**
		 * Laptop media query limit (max-width) in px
		 *
		 * @default 1080
		 * @mediaQuery
		 */
		laptop?: number;
		/**
		 * Tablet media query limit (max-width) in px
		 *
		 * @default 768
		 * @mediaQuery
		 */
		tablet?: number;
		/**
		 * Mobile media query limit (max-width) in px
		 *
		 * @default 576
		 * @mediaQuery
		 */
		mobile?: number;
	};
	swal?: {
		overrides?: SweetAlertOptions;
		preventOverrides?: SweetAlertOptions;
		loaderOverrides?: SweetAlertOptions;
	};
	/**
	 * Iso2 code for the default country
	 *
	 * When a country is provided forms will omit that field
	 */
	country?: string;
	/**
	 * Countries API base endpoint
	 *
	 * If using nuxt, get better performance with the module
	 * @see https://www.npmjs.com/package/nuxt-countries-api
	 *
	 * Using an absolute path will enable the module
	 *
	 * @default "https://countries.xamu.com.co/api/v1"
	 */
	countriesUrl?: string;
	/**
	 * Disable automatic animations
	 *
	 * @default false
	 */
	disableAutoAnimate?: boolean;
	/**
	 * Use pro Font Awesome icons (regular, light)
	 *
	 * @default false
	 */
	fontAwesomePro?: boolean;
	/**
	 * Default pagination limit
	 *
	 * @default 10
	 */
	first?: number;
}
