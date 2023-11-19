const update = require("../../scripts/update-version.cjs");

(async () => {
	// Update packages that depent on this one
	await update(["common-types", "common-helpers", "components-vue", "nuxt"]);
})();
