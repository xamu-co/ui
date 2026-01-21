import {
	defineNuxtModule,
	addPlugin,
	addComponent,
	createResolver,
	addImports,
	addImportsDir,
	addTemplate,
} from "@nuxt/kit";
import upperFirst from "lodash-es/upperFirst";
import camelCase from "lodash-es/camelCase";
import omit from "lodash-es/omit";

import locale from "@open-xamu-co/ui-common-helpers/en";
import { componentNames } from "@open-xamu-co/ui-common-enums";

import type { Stylesheet, XamuModuleOptions } from "./types";
import type { ModuleDependencyMeta } from "nuxt/schema";

export * from "./types";

/**
 * Preload stylesheet and once loaded call them
 * @param {string} href - Resource url
 * @returns {object} Link object
 */
export function getStyleSheetPreload(href: Stylesheet) {
	return {
		rel: "preload",
		as: "style" as const,
		onload: "this.onload=null;this.rel='stylesheet'",
		href: typeof href === "string" ? href : href.href,
		tagPriority: typeof href === "object" ? href.tagPriority : undefined,
	};
}

const stylesheets: Stylesheet[] = [
	"https://unpkg.com/@fortawesome/fontawesome-free@^6/css/all.min.css",
	"https://unpkg.com/sweetalert2@^11/dist/sweetalert2.min.css",
];

/**
 * Nuxt module for @open-xamu-co/ui
 */
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
		countriesUrl: "/_countries",
		swal: {
			overrides: {
				customClass: {
					confirmButton: ["bttn"],
					cancelButton: ["bttnToggle"],
					denyButton: ["link"],
				},
			},
			preventOverrides: {
				customClass: {
					confirmButton: ["bttn", "--tm-danger-light"],
					cancelButton: ["bttnToggle"],
					denyButton: ["link"],
				},
			},
		},
	},
	async setup({ logger, ...moduleOptions }, nuxt) {
		const { globalComponents, componentPrefix } = moduleOptions;
		const { resolve } = createResolver(import.meta.url);
		const runtimePath = resolve("./runtime");

		// Setup nuxt options
		nuxt.options.vite.resolve = {
			...nuxt.options.vite.resolve,
			preserveSymlinks: true,
			dedupe: [
				...(nuxt.options.vite.resolve?.dedupe || []),
				"@open-xamu-co/ui-components-vue",
			],
		};
		nuxt.options.runtimeConfig.public.xamu = omit(moduleOptions, [
			"image",
			"imageHost",
			"disableCountriesModule",
			"disableCSSMeta",
		]);
		nuxt.options.router.options = {
			...nuxt.options.router.options,
			linkActiveClass: "is--route",
			linkExactActiveClass: "is--routeExact",
			scrollBehaviorType: "smooth",
		};
		nuxt.options.app.keepalive = true;

		if (!moduleOptions.disableCSSMeta) {
			// inject css meta tags
			nuxt.options.app = { ...nuxt.options.app };
			nuxt.options.app.head = { ...nuxt.options.app.head };
			nuxt.options.app.head.link ||= [];
			nuxt.options.app.head.link.push(
				{ rel: "preconnect", href: "https://unpkg.com/", crossorigin: "anonymous" },
				{ rel: "dns-prefetch", href: "https://unpkg.com/" },
				...stylesheets.map(getStyleSheetPreload)
			);
		}

		// Logger
		addTemplate({
			filename: "ui-nuxt.mjs",
			getContents: () => `
				/** Logger is present */
				export const withLogger = ${!!logger};
				export function useXamuUILogger(...args) {
					return (${logger?.toString() || "() => {}"})(...args)
				}
			`,
		});

		// Register components config plugin
		addPlugin(resolve(runtimePath, "plugins", "config"));

		// Filter and register components if enabled
		if (globalComponents) {
			const components = Array.isArray(globalComponents) ? globalComponents : componentNames;

			components.forEach((name) => {
				addComponent({
					name: upperFirst(camelCase(componentPrefix)) + name,
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

		// Markdown composable
		addImports({
			name: "useMarkdown",
			as: "useMarkdown",
			from: "@open-xamu-co/ui-components-vue",
		});

		// Other composables, config required
		addImportsDir(resolve(runtimePath, "composables"));
	},
	moduleDependencies(nuxt) {
		const { countriesUrl = "/_countries", disableCountriesModule } = nuxt.options.xamu || {};

		const dependencies: Record<string, ModuleDependencyMeta<Record<string, unknown>>> = {
			"@nuxt/image": {
				version: ">=1.0.0",
				defaults: {
					provider: "ipx",
					presets: { avatar: { modifiers: { width: 60, height: 60 } } },
					format: ["webp", "jpg"],
				},
			},
		};

		if (
			countriesUrl &&
			!countriesUrl?.includes("countries.xamu.com.co") &&
			!disableCountriesModule
		) {
			let pathname = countriesUrl;

			try {
				pathname = new URL(countriesUrl).pathname;
			} catch (err) {
				// Do nothing, will crash if pathname only
			}

			dependencies["nuxt-countries-api"] = {
				version: ">=1.0.0",
				defaults: { base: pathname },
			};
		}

		return dependencies;
	},
});
