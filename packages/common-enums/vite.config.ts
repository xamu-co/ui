import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: {
				// root
				index: path.resolve(__dirname, "./src"),
			},
			name: "@open-xamu-co/ui-common-enums",
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
