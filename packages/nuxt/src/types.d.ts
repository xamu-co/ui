import type { ModuleOptions as NuxtImageOptions } from "@nuxt/image";

import type { iVuePluginOptions } from "@open-xamu-co/ui-components-vue/plugin";

/**
 * Nuxt specific configuration
 */
export interface XamuModuleOptions extends iVuePluginOptions {
	/**
	 * Nuxt image module options
	 */
	image?: Partial<NuxtImageOptions>;
	/**
	 * Disable CSS meta tags
	 *
	 * @default false
	 */
	disableCSSMeta?: boolean;
	/**
	 * Disable NUXT countries module
	 */
	disableCountriesModule?: boolean;
}

declare module "nuxt/schema" {
	interface AppConfigInput {
		xamu?: XamuModuleOptions;
	}
}
declare module "@nuxt/schema" {
	interface AppConfigInput {
		xamu?: XamuModuleOptions;
	}
}
