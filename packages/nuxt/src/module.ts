/* eslint-disable @typescript-eslint/ban-ts-comment */
import path from "node:path";
import {
	defineNuxtModule,
	addPlugin,
	addComponent,
	createResolver,
	installModule,
	addImports,
	addImportsDir,
} from "@nuxt/kit";
import upperFirst from "lodash-es/upperFirst";
import camelCase from "lodash-es/camelCase";

import locale from "@open-xamu-co/ui-common-helpers/en";
import { componentNames } from "@open-xamu-co/ui-common-enums";

import type { XamuModuleOptions } from "./types";

/**
 * Preload stylesheet and once loaded call them
 * @param {string} href - Resource url
 * @returns {object} Link object
 */
function getStyleSheetPreload(href: string) {
	return {
		rel: "preload",
		as: "style" as const,
		onload: "this.onload=null;this.rel='stylesheet'",
		href,
	};
}

const stylesheets: string[] = [
	"https://unpkg.com/@fortawesome/fontawesome-free@^6/css/all.min.css",
	"https://unpkg.com/sweetalert2@^11/dist/sweetalert2.min.css",
];

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
		const { globalComponents, componentPrefix, image, countriesUrl } = moduleOptions;
		const { resolve, resolvePath } = createResolver(import.meta.url);
		const runtimePath = resolve("./runtime");

		// @ts-ignore
		nuxt.options.appConfig.xamu = moduleOptions;

		if (!moduleOptions.disableCSSMeta) {
			// inject css
			nuxt.options.app = { ...nuxt.options.app };
			nuxt.options.app.head = { ...nuxt.options.app.head };
			nuxt.options.app.head.link ||= [];
			nuxt.options.app.head.link.push(
				{ rel: "preconnect", href: "https://unpkg.com/", crossorigin: "anonymous" },
				{ rel: "dns-prefetch", href: "https://unpkg.com/" },
				...stylesheets.map(getStyleSheetPreload)
			);
		}

		// Register components config plugin
		addPlugin(resolve(runtimePath, "plugins", "config"));

		await installModule("@nuxt/image", {
			provider: "ipx",
			presets: { avatar: { modifiers: { width: 60, height: 60 } } },
			format: ["webp", "jpg"],
			// override defaults
			...image,
		});

		if (countriesUrl && path.isAbsolute(countriesUrl)) {
			await installModule("nuxt-countries-api", { base: countriesUrl });
		}

		// Filter and register components if enabled
		if (globalComponents) {
			const components = Array.isArray(globalComponents) ? globalComponents : componentNames;
			const filePath = await resolvePath("@open-xamu-co/ui-components-vue"); // node_modules/@open-xamu-co/ui-components-vue/dist/index.mjs

			components.forEach((name) => {
				addComponent({
					name: upperFirst(camelCase(componentPrefix)) + name,
					filePath,
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
