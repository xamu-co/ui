import type { DefineComponent, FunctionalComponent, Component as VueComponent } from "vue";
import type { ModuleOptions as NuxtImageOptions } from "@nuxt/image";

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

/**
 * Nuxt specific configuration
 */
export interface XamuModuleOptions
	extends iPluginOptions<VueComponent | FunctionalComponent | DefineComponent> {
	/**
	 * Nuxt image module options
	 */
	image?: Partial<NuxtImageOptions>;
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
