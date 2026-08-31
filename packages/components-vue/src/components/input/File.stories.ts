import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, userEvent, expect, waitFor } from "storybook/test";
import { ref, watch } from "vue";

import InputFile from "./File.vue";
import { renameFile } from "@open-xamu-co/ui-common-helpers";

const meta: Meta<typeof InputFile> = {
	title: "Input/Input File",
	component: InputFile,
	args: { modelValue: [] },
	tags: ["test"],
};

type Story = StoryObj<typeof meta>;

/**
 * Valid 16-byte PNG header — passes fileMatchesMimeTypes magic-byte check
 * without loading actual image data.
 */
const PNG_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0, 0, 0, 0, 0]);

/**
 * Files larger than the thumbnailMaxSize threshold must not generate an Object URL thumbnail.
 * Instead the generic file icon is shown and the tooltip switches to the heavy-file locale string.
 *
 * thumbnailMaxSize is set to 1 byte so any real file (even tiny ones) triggers the heavy-file
 * path without needing to fake File.size via Object.defineProperty.
 */
export const Sample: Story = {
	args: {
		// Limit the maximum number of files
		max: 1,
	},
	render: (args) => ({
		components: { InputFile },
		setup() {
			const model = ref(args.modelValue || []);
			const thumbnailMaxSize = ref<number>();

			// Keeps v-model in sync with storybook args
			watch(
				() => args,
				(newArgs) => {
					model.value = newArgs.modelValue;
					thumbnailMaxSize.value = newArgs.thumbnailMaxSize;
				}
			);

			const runOnce = watch(
				model,
				(newModel) => {
					if (!newModel.length) return;

					setTimeout(() => {
						thumbnailMaxSize.value = 1;
					}, 1);
					runOnce();
				},
				{ immediate: true }
			);

			return { args, model, thumbnailMaxSize };
		},
		template:
			'<InputFile v-bind="args" :thumbnail-max-size="thumbnailMaxSize" v-model="model" />',
	}),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;

		expect(input).toBeInTheDocument();

		// Create a small mock PNG file (well below the 50 MB thumbnail threshold)
		const file = new File([PNG_HEADER], "test.png", { type: "image/png" });

		// Upload the file
		await userEvent.upload(input, file);

		// Verify count display
		await waitFor(() => {
			const statusText = canvas.getByText(/1\s+(de|of)\s+1/i);

			expect(statusText).toBeInTheDocument();
		});

		// Verify that a thumbnail <img> is rendered (file is below 100 MB threshold)
		await waitFor(() => {
			const thumbnail = canvasElement.querySelector("img");

			expect(thumbnail).toBeInTheDocument();
			// The src must be a blob URL created by URL.createObjectURL
			expect(thumbnail?.src).toMatch(/^blob:/);
		});

		const deleteFileButton = canvas.getByText(/Eliminar archivo|Delete file/i);

		expect(deleteFileButton).toBeInTheDocument();
		// Clear the file
		await userEvent.click(deleteFileButton);

		// Verify input is ready for a new file
		await waitFor(() => {
			const statusText = canvas.getByText(/O arrástralo aquí|Or drop it here/i);

			expect(statusText).toBeInTheDocument();
		});

		// Upload a new file
		await userEvent.upload(input, renameFile(file, "new.png"));

		// Verify the count display appears (thumbnail entry was added with empty source)
		await waitFor(() => {
			const statusText = canvas.getByText(/1\s+(de|of)\s+1/i);

			expect(statusText).toBeInTheDocument();
		});
		// Verify that NO <img> thumbnail is rendered (file exceeds thumbnailMaxSize)
		await waitFor(() => {
			const thumbnail = canvasElement.querySelector("img");

			expect(thumbnail).toBeNull();
		});
		// Verify the generic file icon is rendered instead
		await waitFor(() => {
			// IconFa renders an <i> or <svg> inside the thumbnail container
			const icon = canvasElement.querySelector(".back i.icon");

			expect(icon).toBeInTheDocument();
		});
	},
};

export const AcceptVideo: Story = {
	args: {
		accept: ["video/*"],
	},
	render: (args) => ({
		components: { InputFile },
		setup() {
			const model = ref(args.modelValue);

			// Keeps v-model in sync with storybook args
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
		const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;

		expect(input).toBeInTheDocument();
		// Verify the native input has the correct accept attribute
		expect(input.getAttribute("accept")).toContain("video/");
	},
};

export default meta;
