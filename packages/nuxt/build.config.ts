import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	failOnWarn: false,
	externals: ["@open-xamu-co/ui-common-types"],
});
