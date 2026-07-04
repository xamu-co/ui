import type { StoryObj } from "@storybook/vue3-vite";

import type { GenericMeta } from "../../types/storybook";

import LoaderContentFetch from "./ContentFetch.vue";

const meta: GenericMeta<typeof LoaderContentFetch> = {
	title: "Loader/Loader Content Fetch",
	component: LoaderContentFetch,
	args: {},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
	render: (args) => ({
		components: { LoaderContentFetch },
		setup() {
			const promise = () => Promise.resolve("Hello");

			return { args, promise };
		},
		template: `
			<suspense>
				<LoaderContentFetch v-slot="{ content }" v-bind="args" :promise="promise">
					{{ content }}
				</LoaderContentFetch>
			</suspense>
		`,
	}),
};

export default meta;
