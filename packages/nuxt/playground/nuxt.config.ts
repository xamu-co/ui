import locale from "@open-xamu-co/ui-common-helpers/es";

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

export default defineNuxtConfig({
	compatibilityDate: "2025-12-16",
	app: {
		head: {
			title: "Nuxt module playground",
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "robots", content: "noindex, nofollow" },
			],
			link: [
				{
					rel: "preconnect",
					href: "https://fonts.googleapis.com/",
					crossorigin: "anonymous",
				},
				{ rel: "dns-prefetch", href: "https://fonts.googleapis.com/" },
				{ rel: "preconnect", href: "https://unpkg.com/", crossorigin: "anonymous" },
				{ rel: "dns-prefetch", href: "https://unpkg.com/" },
				...[
					"https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,500;0,700;0,900;1,300;1,500;1,700;1,900&display=swap",
					"https://unpkg.com/@fortawesome/fontawesome-free@^6/css/all.min.css",
					"https://unpkg.com/sweetalert2@^11/dist/sweetalert2.min.css",
				].map(getStyleSheetPreload),
			],
		},
	},
	css: ["@open-xamu-co/ui-styles/dist/index.min.css"],
	modules: ["../src/module"],
	xamu: {
		locale,
		lang: "es",
		country: "co",
		image: {
			domains: ["firebasestorage.googleapis.com"],
			alias: { firebase: "https://firebasestorage.googleapis.com" },
		},
		imageHosts: ["lh3.googleusercontent.com"],
	},
	devtools: { enabled: true },
});
