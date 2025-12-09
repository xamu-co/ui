import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		"@storybook/addon-vitest",
		"@storybook/addon-onboarding",
		"@storybook/addon-docs",
		"@chromatic-com/storybook",
	],
	framework: {
		name: "@storybook/vue3-vite",
		options: {
			docgen: "vue-component-meta",
		},
	},
};
export default config;
