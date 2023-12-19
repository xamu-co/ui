/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { DefineComponent, FunctionalComponent, Component as VueComponent } from "vue";
import {
	defineNuxtModule,
	addPlugin,
	addComponent,
	createResolver,
	installModule,
	addImports,
} from "@nuxt/kit";
import _ from "lodash";
import type { ModuleOptions as NuxtImageOptions } from "@nuxt/image";

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";
import locale from "@open-xamu-co/ui-common-helpers/en";
import { componentNames } from "@open-xamu-co/ui-common-enums";

/**
 * Nuxt specific configuration
 */
interface ModuleOptions
	extends iPluginOptions<VueComponent | FunctionalComponent | DefineComponent> {
	/**
	 * Nuxt image plugin options
	 */
	image?: Partial<NuxtImageOptions>;
}

declare module "nuxt/schema" {
	interface AppConfigInput {
		xamu?: ModuleOptions;
	}
}
declare module "@nuxt/schema" {
	interface AppConfigInput {
		xamu?: ModuleOptions;
	}
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "@open-xamu-co/ui-nuxt",
		configKey: "xamu",
		compatibility: { nuxt: "^3.0.0" },
	},
	defaults: {
		// Set plugin defaults
		globalComponents: true,
		componentPrefix: "xamu",
		mediaQueryPixels: { laptop: 1080, tablet: 768, mobile: 576 },
		locale,
		lang: "en",
		first: 10,
	},
	async setup(moduleOptions, nuxt) {
		const { globalComponents, componentPrefix, image } = moduleOptions;
		const { resolve } = createResolver(import.meta.url);
		const runtimePath = resolve("./runtime");

		nuxt.options.build.transpile.push("@open-xamu-co/ui-components-vue");
		// @ts-ignore
		nuxt.options.appConfig.xamu = moduleOptions;
		// Register components config plugin
		addPlugin(resolve(runtimePath, "plugins", "config"));

		await installModule("@nuxt/image", {
			provider: "ipx",
			presets: { avatar: { modifiers: { width: 60, height: 60 } } },
			format: ["webp", "jpg"],
			// override defaults
			...image,
		});

		// Filter and register components if enabled
		if (globalComponents) {
			const components = Array.isArray(globalComponents) ? globalComponents : componentNames;

			components.forEach((name) => {
				addComponent({
					name: _.capitalize(_.camelCase(componentPrefix)) + name,
					filePath: "@open-xamu-co/ui-components-vue",
					export: name,
					mode: "all",
				});
			});
		}

		// Theme composable
		addImports({
			name: "useTheme",
			as: "useTheme",
			from: "@open-xamu-co/ui-components-vue",
		});
	},
});
