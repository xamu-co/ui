import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, coverageConfigDefaults, configDefaults } from "vitest/config";

import viteConfig from "./vite.config";

/**
 * Coverage threshold for tests
 * TODO: Increase helpers tests coverage to 80%
 */
const coverage = 10;

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			coverage: {
				provider: "v8",
				thresholds: {
					// Percentages from latest tests (04/07/2026)
					lines: coverage, // 69.34%
					functions: coverage, // 62.42%
					branches: coverage, // 57.81%
					statements: coverage, // 65.84%
				},
				exclude: coverageConfigDefaults.exclude,
			},
			projects: [
				{
					extends: true,
					test: {
						name: "helpers",
						environment: "node",
						root: fileURLToPath(new URL("./", import.meta.url)),
					},
				},
			],
			exclude: configDefaults.exclude,
		},
	})
);
