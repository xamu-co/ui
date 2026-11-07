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
const PDF_HEADER = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
const ZIP_HEADER = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);

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

export const AcceptSpecificMime: Story = {
	args: {
		accept: ["image/png"],
		filePrefix: "avatar",
		max: 1,
	},
	render: (args) => ({
		components: { InputFile },
		setup() {
			const model = ref(args.modelValue || []);

			watch(
				() => args.modelValue,
				(val) => {
					model.value = val || [];
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
		expect(input.getAttribute("accept")).toBe("image/png");

		// Upload valid PNG file
		const file = new File([PNG_HEADER], "profile.png", { type: "image/png" });

		await userEvent.upload(input, file);

		// Verify count display
		await waitFor(() => {
			const statusText = canvas.getByText(/1\s+(de|of)\s+1/i);

			expect(statusText).toBeInTheDocument();
		});

		// Verify that a thumbnail <img> is rendered
		await waitFor(() => {
			const thumbnail = canvasElement.querySelector("img");

			expect(thumbnail).toBeInTheDocument();
			expect(thumbnail?.src).toMatch(/^blob:/);
		});
	},
};

export const AcceptDocumentsAndCompressed: Story = {
	args: {
		accept: [
			"application/pdf",
			"image/*",
			"audio/*",
			".zip",
			".rar",
			".doc",
			".docx",
			".xls",
			".xlsx",
			".ppt",
			".pptx",
			".txt",
		],
		filePrefix: "doc",
		max: 3,
	},
	render: (args) => ({
		components: { InputFile },
		setup() {
			const model = ref(args.modelValue || []);

			watch(
				() => args.modelValue,
				(val) => {
					model.value = val || [];
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

		// Upload a valid PDF file
		const pdfFile = new File([PDF_HEADER], "document.pdf", { type: "application/pdf" });

		await userEvent.upload(input, pdfFile);

		// Verify count display for 1 file
		await waitFor(() => {
			const statusText = canvas.getByText(/1\s+(de|of)\s+3/i);

			expect(statusText).toBeInTheDocument();
		});

		// Verify PDF icon is rendered (fa-file-pdf)
		await waitFor(() => {
			const pdfIcon = canvasElement.querySelector(".fa-file-pdf");

			expect(pdfIcon).toBeInTheDocument();
		});

		// Upload a valid ZIP file
		const zipFile = new File([ZIP_HEADER], "archive.zip", { type: "application/zip" });

		await userEvent.upload(input, zipFile);

		// Verify count display for 2 files
		await waitFor(() => {
			const statusText = canvas.getByText(/2\s+(de|of)\s+3/i);

			expect(statusText).toBeInTheDocument();
		});

		// Verify ZIP icon is rendered (fa-file-zipper)
		await waitFor(() => {
			const zipIcon = canvasElement.querySelector(".fa-file-zipper");

			expect(zipIcon).toBeInTheDocument();
		});

		// Upload a valid TXT file
		const txtFile = new File(["Hello plain text"], "notes.txt", { type: "text/plain" });

		await userEvent.upload(input, txtFile);

		// Verify count display for 3 files
		await waitFor(() => {
			const statusText = canvas.getByText(/3\s+(de|of)\s+3/i);

			expect(statusText).toBeInTheDocument();
		});

		// Verify TXT icon is rendered (fa-file-lines)
		await waitFor(() => {
			const txtIcon = canvasElement.querySelector(".fa-file-lines");

			expect(txtIcon).toBeInTheDocument();
		});
	},
};

export default meta;
