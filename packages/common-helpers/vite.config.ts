import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: {
				// root
				index: path.resolve(__dirname, "./src"),
				// utils
				utils: path.resolve(__dirname, "./src/utils"),
				swal: path.resolve(__dirname, "./src/swal"),
				form: path.resolve(__dirname, "./src/form/composable"),
				// locale
				i18n: path.resolve(__dirname, "./src/i18n"),
				en: path.resolve(__dirname, "./src/locale/en"),
				es: path.resolve(__dirname, "./src/locale/es"),
			},
			name: "@open-xamu-co/ui-common-helpers",
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled into your library
			external: [],
			preserveEntrySignatures: "strict",
			treeshake: { moduleSideEffects: false },
		},
	},
});
