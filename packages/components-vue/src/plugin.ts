import {
	type Plugin,
	type Component as VueComponent,
	type DefineComponent,
	type FunctionalComponent,
	defineCustomElement,
} from "vue";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

import type { tPropertyMapping, iPluginOptions } from "@open-xamu-co/ui-common-types";
import locale from "@open-xamu-co/ui-common-helpers/en";
import { componentNames } from "@open-xamu-co/ui-common-enums";

import * as components from ".";

export const XamuPlugin: Plugin<
	iPluginOptions<VueComponent | FunctionalComponent | DefineComponent>
> = {
	install(V, options) {
		options = {
			// Set plugin defaults
			globalComponents: true,
			componentPrefix: "xamu",
			mediaQueryPixels: { laptop: 1080, tablet: 768, mobile: 576 },
			locale,
			lang: "en",
			first: 10,
			countriesUrl: "https://countries.xamu.com.co/api/v1",
			// override defaults
			...options,
		};

		const { globalComponents, componentPrefix, webComponents } = options;

		// Set plugin options globally
		V.provide("xamu", options);

		if (!globalComponents) return;

		// Filter and register components
		const componentKeys = Array.isArray(globalComponents) ? globalComponents : componentNames;

		// Register components
		componentKeys.forEach((key) => {
			const name = upperFirst(camelCase(componentPrefix)) + key;
			const component = <DefineComponent>components[key];

			/**
			 * There is an issue with custom elements and emits
			 *
			 * @see https://github.com/vuejs/core/issues/7782
			 */
			if (webComponents) {
				// register as a web component
				const webComponent = defineCustomElement(component);

				customElements.define(name, webComponent);
			} else {
				// register as a Vue component
				V.component(name, component);
			}
		});
	},
};

declare module "@vue/runtime-core" {
	// TODO: (filter components & add suffix) plugin based
	export interface GlobalComponents extends tPropertyMapping<typeof components, "xamu"> {}
}
