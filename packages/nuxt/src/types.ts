import type { ModuleOptions as NuxtImageOptions } from "@nuxt/image";

import type { iVuePluginOptions } from "@open-xamu-co/ui-components-vue/plugin";

/**
 * Nuxt specific configuration
 */
export interface XamuModuleOptions extends Omit<iVuePluginOptions, "internals"> {
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

export type Stylesheet = string | { href: string; tagPriority?: number };

declare module "nuxt/schema" {
	interface PublicRuntimeConfig {
		xamu: XamuModuleOptions;
	}
}
declare module "@nuxt/schema" {
	interface PublicRuntimeConfig {
		xamu: XamuModuleOptions;
	}
}
