import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { expect } from "storybook/test";

import ErrorBoundary from "./ErrorBoundary.vue";

const meta: Meta<typeof ErrorBoundary> = {
	title: "Base/Error Boundary",
	component: ErrorBoundary,
	args: {},
};

type Story = StoryObj<typeof meta>;

// A helper component that throws an error when rendered
const ErrorThrower = {
	setup() {
		throw new Error("Simulated setup render error");
	},
	template: "<div>This will not render</div>",
};

export const Sample: Story = {
	render: (args) => ({
		components: { ErrorBoundary, ErrorThrower },
		setup() {
			return { args };
		},
		template: `
			<ErrorBoundary v-bind="args" at="StoriesTest">
				<ErrorThrower />
			</ErrorBoundary>
		`,
	}),
	play: async ({ canvasElement }) => {
		// ErrorBoundary displays a BoxMessage with default error message
		// We expect the fallback slot/content to be displayed
		const textContent = canvasElement.textContent;

		expect(textContent).toContain("Couldn't render the contents due to an unknown error");
	},
};

export default meta;
