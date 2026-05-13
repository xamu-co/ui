var __spreadArray =
	(this && this.__spreadArray) ||
	function (to, from, pack) {
		if (pack || arguments.length === 2) {
			for (var i = 0, l = from.length, ar; i < l; i++) {
				if (ar || !(i in from)) {
					if (!ar) ar = Array.prototype.slice.call(from, 0, i);

					ar[i] = from[i];
				}
			}
		}

		return to.concat(ar || Array.prototype.slice.call(from));
	};

import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults, coverageConfigDefaults } from "vitest/config";
import viteConfig from "./vite.config";
import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

/**
 * Coverage threshold for tests
 * TODO: Increase test coverage to 80%
 */
var coverage = 40;
var dirname =
	typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			coverage: {
				provider: "v8",
				thresholds: {
					lines: coverage, // 58.84%
					functions: coverage, // 50.82%
					branches: coverage, // 47.15%
					statements: coverage, // 55.74%
				},
				exclude: __spreadArray(
					__spreadArray([], coverageConfigDefaults.exclude, true),
					["e2e/**", ".storybook/**"],
					false
				),
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
			exclude: __spreadArray(
				__spreadArray([], configDefaults.exclude, true),
				["e2e/**", ".storybook/**"],
				false
			),
		},
	})
);
