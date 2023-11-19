const update = require("../../scripts/update-version.cjs");

(async () => {
	// Update packages that depent on this one
	await update(["nuxt"]);
})();
