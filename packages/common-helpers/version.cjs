const update = require("../../scripts/update-version.cjs");

(async () => {
	try {
		// Update packages that depent on this one
		await update(["components-vue", "components-svelte", "nuxt"]);
	} catch (e) {
		console.log("could not update dependencies version", e);
	}
})();
