const sort = {
	sort: "desktop-first",
	configuration: { unitlessMqAlwaysFirst: true },
	onlyTopLevel: false,
};

/**
 * Postcss configs
 */
module.exports = {
	developtment: {
		plugins: [
			require("postcss-merge-at-rules")({}), // flatten & merge
			require("postcss-sort-media-queries")(sort),
		],
	},
	production: {
		map: false,
		plugins: [
			// Optimizations
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
			require("postcss-merge-at-rules")({}), // flatten & merge
			require("postcss-sort-media-queries")(sort),
			require("postcss-precision")({}),
		],
		env: "production",
		preset: {
			stage: 4,
			features: { "nesting-rules": { noIsPseudoSelector: true } },
			minimumVendorImplementations: 3,
			autoprefixer: false,
		},
	},
};
