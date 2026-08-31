import type { StoryObj } from "@storybook/vue3-vite";
import { expect, waitFor, within } from "storybook/test";

import type { GenericMeta } from "../../types/storybook";

import LoaderContentFetch from "./ContentFetch.vue";

const meta: GenericMeta<typeof LoaderContentFetch> = {
	title: "Loader/Loader Content Fetch",
	component: LoaderContentFetch,
	args: {},
	tags: ["test"],
};

type Story = StoryObj<typeof meta>;

/**
 * Test async data resolution and content rendering
 */
export const Sample: Story = {
	args: {},
	render: (args) => ({
		components: { LoaderContentFetch },
		setup() {
			const promise = () => Promise.resolve("Hello World Content");

			return { args, promise };
		},
		template: `
			<suspense>
				<LoaderContentFetch v-slot="{ content }" v-bind="args" :promise="promise">
					<span data-testid="fetched-content">{{ content }}</span>
				</LoaderContentFetch>
			</suspense>
		`,
	}),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(() => {
			expect(canvas.getByTestId("fetched-content")).toHaveTextContent("Hello World Content");
		});
	},
};

export default meta;
