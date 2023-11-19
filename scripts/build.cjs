const { exec } = require("child_process");
const build = process.env.BUILD || String(process.env.BUILD).toLowerCase() === "true";
const [, tag] = process.argv.find((value) => value.startsWith("tag")).split("=");
const pkgName = tag.substring(0, tag.lastIndexOf("-"));

if (build) {
	// run build command
	exec("yarn build", (error, stdout, stderr) => {
		console.log(`Build "${pkgName}" distributables`);

		if (error) return console.error(`Error while building: ${error}`);

		console.log(stdout, stderr);
	});
} else console.log(`Bypass "${pkgName}" build`);
