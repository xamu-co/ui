const { readFile, writeFile } = require("fs/promises");
const { join } = require("path");
const [, tag] = process.argv.find((value) => value.startsWith("tag")).split("=");
const splitAt = tag.lastIndexOf("-v");
const pkgName = tag.substring(0, splitAt);
const version = tag.substring(splitAt + 2);

/**
 * Updates the workspace dependencies versions before releasing the package
 * @param {string[]} packages - list of packages to update
 * @param {boolean} dev - whether to update devDependencies or dependencies
 * @returns {void}
 */
module.exports = async function (packages = [], dev = false) {
	console.log(
		"\x1b[34m%s\x1b[0m",
		`Updating dependant packages with "${pkgName}" version "${version}"`
	);

	for (let index = 0; index < packages.length; index++) {
		console.log("\x1b[34m%s\x1b[0m", `Updating "${packages[index]}"`);

		const pkgJSONPath = join(__dirname, "../packages", packages[index], "package.json");
		const pkgJSON = JSON.parse(await readFile(pkgJSONPath, { encoding: "utf8" }));
		const pkgType = dev ? "devDependencies" : "dependencies";

		if (!pkgJSON[pkgType]?.[pkgName]) {
			console.log(
				"\x1b[34m%s\x1b[0m",
				`Couldn't find "${pkgName}" in "${packages[index]}" ${pkgType}, skipping`
			);

			continue;
		}

		// update pkg version
		pkgJSON[pkgType][pkgName] = `^${version}`;
		// override existing file
		await writeFile(pkgJSONPath, JSON.stringify(pkgJSON, null, 2));

		console.log("\x1b[34m%s\x1b[0m", `Succesfully updated "${packages[index]}" package`);
	}
};
