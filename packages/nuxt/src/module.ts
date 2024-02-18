/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	defineNuxtModule,
	addPlugin,
	addComponent,
	createResolver,
	installModule,
	addImports,
	addImportsDir,
} from "@nuxt/kit";
import _ from "lodash";

import locale from "@open-xamu-co/ui-common-helpers/en";
import { componentNames } from "@open-xamu-co/ui-common-enums";

import type { XamuModuleOptions } from "./types.js";

export default defineNuxtModule<XamuModuleOptions>({
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
		countriesUrl: "https://countries.xamu.com.co/api/v1",
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

		// Other composables, config required
		addImportsDir(resolve(runtimePath, "composables"));
	},
});
