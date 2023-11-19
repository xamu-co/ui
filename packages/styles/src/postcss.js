const sort = {
	sort: "desktop-first",
	configuration: { unitlessMqAlwaysFirst: true },
};

/**
 * Postcss configs
 */
module.exports = {
	developtment: {
		plugins: [require("postcss-sort-media-queries")(sort)],
	},
	production: {
		map: false,
		plugins: [
			// Optimizations
			require("postcss-preset-env")({
				stage: 4,
				features: { "nesting-rules": { noIsPseudoSelector: true } },
				minimumVendorImplementations: 3,
				autoprefixer: false,
			}),
			require("cssnano")({
				preset: [
					"advanced",
					{
						discardComments: { removeAll: true },
						zindex: false,
					},
				],
			}),
			require("postcss-merge-selectors")({}),
			require("postcss-sort-media-queries")(sort),
			require("postcss-merge-at-rules")({ nest: true }),
			require("postcss-precision")({}),
		],
		env: "production",
		preset: { stage: false },
	},
};
