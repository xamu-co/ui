import path from "node:path";
import _ from "lodash";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import type { tComponent } from "@open-xamu-co/ui-common-types";
import { componentNames } from "@open-xamu-co/ui-common-enums";

function getChunkPath(name: string) {
	const sentence = _.startCase(name).split(" ");
	const dir = (sentence.length > 1 && sentence.shift()) || "";

	return path.join(dir.toLowerCase(), sentence.join(""));
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	optimizeDeps: { include: [] },
	build: {
		lib: {
			entry: {
				// root
				"components/index": path.resolve(__dirname, "./src/components"),
				plugin: path.resolve(__dirname, "./src/plugin"),
				// components
				...Object.fromEntries(
					componentNames.map((name) => {
						return [
							name,
							path.resolve(__dirname, `src/components/${getChunkPath(name)}.vue`),
						];
					})
				),
			},
			name: "@open-xamu-co/ui-components-vue",
			fileName(format, name: tComponent) {
				const ext = (format === "es" && "mjs") || format;
				const isComponent = componentNames.includes(name);

				if (!isComponent) return `${name}.${ext}`;

				return path.join("components", `${getChunkPath(name)}.vue.${ext}`);
			},
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled into your library
			external: ["vue"],
			output: {
				chunkFileNames: "_virtual/[name].[format].js",
				manualChunks(id) {
					if (id.includes("node_modules")) {
						const residue = id.split("/node_modules/")[1];

						if (!residue) return "vendor";

						const [orgOrName, name] = residue.split("/");

						return orgOrName.charAt(0) === "@" ? `${orgOrName}/${name}` : orgOrName;
					}
					if (id.includes(".vue")) {
						const chunkPath = id.split("")[1].split(".")[0];

						return _.snakeCase(["chunk", ...chunkPath.split("/")].join(" "));
					}
				},
				// Provide global variables to use in the UMD build for externalized deps
				globals: { vue: "Vue" },
			},
			treeshake: { moduleSideEffects: false },
		},
	},
});
