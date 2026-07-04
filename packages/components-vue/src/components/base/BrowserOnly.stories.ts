import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { expect } from "storybook/test";

import BrowserOnly from "./BrowserOnly.vue";

const meta: Meta<typeof BrowserOnly> = {
	title: "Base/Browser Only",
	component: BrowserOnly,
	args: {},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { BrowserOnly },
		setup() {
			return { args };
		},
		template: `
			<BrowserOnly v-bind="args">
				<div data-testid="default-slot">Only visible in browser</div>
				<template #fallback>
					<div data-testid="fallback-slot">Visible on server</div>
				</template>
			</BrowserOnly>
		`,
	}),
	play: async ({ canvasElement }) => {
		// Since storybook tests run in Playwright (chromium browser), isBrowser is true.
		// The default slot should be rendered.
		const defaultSlot = canvasElement.querySelector("[data-testid='default-slot']");
		const fallbackSlot = canvasElement.querySelector("[data-testid='fallback-slot']");

		expect(defaultSlot).toBeInTheDocument();
		expect(defaultSlot).toHaveTextContent("Only visible in browser");
		expect(fallbackSlot).not.toBeInTheDocument();
	},
};

export default meta;
