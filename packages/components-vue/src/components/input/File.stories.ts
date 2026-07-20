import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, userEvent, expect, waitFor } from "storybook/test";
import { ref, watch } from "vue";

import InputFile from "./File.vue";

const meta: Meta<typeof InputFile> = {
	title: "Input/Input File",
	component: InputFile,
	args: { modelValue: [] },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { InputFile },
		setup() {
			const model = ref(args.modelValue);

			// Optional: Keeps v-model in sync with storybook args
			watch(
				() => args.modelValue,
				(val) => {
					model.value = val;
				}
			);

			return { args, model };
		},
		template: '<InputFile v-bind="args" v-model="model" />',
	}),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;

		expect(input).toBeInTheDocument();

		// Create mock image file with valid PNG header bytes to pass fileMatchesMimeTypes check
		const pngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0, 0, 0, 0, 0]);
		const file = new File([pngBytes], "test.png", { type: "image/png" });

		// Upload file
		await userEvent.upload(input, file);
		// Verify count display
		await waitFor(() => {
			const statusText = canvas.getByText(/1\s+(de|of)\s+100/i);

			expect(statusText).toBeInTheDocument();
		});
	},
};

export const AcceptVideo: Story = {
	render: (args) => ({
		components: { InputFile },
		setup() {
			const model = ref(args.modelValue);

			// Optional: Keeps v-model in sync with storybook args
			watch(
				() => args.modelValue,
				(val) => {
					model.value = val;
				}
			);

			return { args, model };
		},
		template: '<InputFile v-bind="args" v-model="model" />',
	}),
	args: {
		accept: ["video/*"],
	},
};

export default meta;
