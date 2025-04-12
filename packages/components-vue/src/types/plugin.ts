import type { Component as VueComponent, DefineComponent, FunctionalComponent } from "vue";
import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

import type { useAsyncDataFn } from "../composables/async";

export type vComponent<P extends Record<string, any> = Record<string, any>> =
	| VueComponent<P>
	| FunctionalComponent<P>
	| DefineComponent<P>;

export interface iVuePluginOptions extends iPluginOptions<vComponent> {
	internals?: {
		/**
		 * Nuxt Async data
		 */
		useAsyncData?: typeof useAsyncDataFn;
		/**
		 * Nitro fetch
		 */
		ofetch?: <T>(url: string, options?: Record<string, any>) => Promise<T>;
	};
}
