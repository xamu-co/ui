import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		dedupe: ["vue"],
	},
	build: {
		lib: {
			entry: {
				// root
				index: path.resolve(__dirname, "./src"),
				// plugin
				plugin: path.resolve(__dirname, "./src/plugin"),
				// theme
				theme: path.resolve(__dirname, "./src/composables/theme"),
			},
			name: "@open-xamu-co/ui-components-vue",
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled into your library
			external: [
				"vue",
				"lodash",
				"nanoid",
				"validator",
				"@open-xamu-co/ui-common-enums",
				"@open-xamu-co/ui-common-helpers",
			],
			output: {
				// Provide global variables to use in the UMD build for externalized deps
				globals: { vue: "Vue" },
			},
			preserveEntrySignatures: "strict",
			treeshake: { moduleSideEffects: false },
		},
	},
});
