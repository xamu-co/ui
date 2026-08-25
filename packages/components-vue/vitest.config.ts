import { fileURLToPath } from "node:url";
import path from "node:path";
import { mergeConfig, defineConfig, configDefaults, coverageConfigDefaults } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

import viteConfig from "./vite.config";

/**
 * Coverage threshold for tests
 * TODO: Increase vue tests coverage to 80%
 */
const coverage = 60;
const dirname =
	typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			coverage: {
				provider: "v8",
				thresholds: {
					// Percentages from latest tests (25/08/2026)
					lines: coverage, // 73.62%
					functions: coverage, // 67.28%
					branches: coverage, // 61.42%
					statements: coverage, // 71.24%
				},
				exclude: [
					...coverageConfigDefaults.exclude,
					"**/node_modules/**",
					"e2e/**",
					".storybook/**",
					"storybook-static/**",
					"coverage/**",
					"**/dist/**",
				],
			},
			projects: [
				{
					extends: true,
					test: {
						name: "e2e",
						environment: "jsdom",
						root: fileURLToPath(new URL("./", import.meta.url)),
					},
				},
				{
					extends: true,
					plugins: [
						// The plugin will run tests for the stories defined in your Storybook config
						// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
						storybookTest({
							// The location of your Storybook config, main.js|ts
							configDir: path.join(dirname, ".storybook"),
							// This should match your package.json script to run Storybook
							// The --ci flag will skip prompts and not open a browser
							storybookScript: "yarn dev --ci",
							tags: { include: ["test"], exclude: ["experimental"] },
						}),
					],
					test: {
						name: "storybook",
						browser: {
							enabled: true,
							headless: true,
							provider: playwright({}),
							instances: [{ browser: "chromium" }],
						},
						setupFiles: [".storybook/vitest.setup.ts"],
					},
				},
			],
			exclude: [
				...configDefaults.exclude,
				"e2e/**",
				".storybook/**",
				"storybook-static/**",
				"coverage/**",
				"**/dist/**",
			],
		},
	})
);
