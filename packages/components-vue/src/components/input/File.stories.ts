import type { Meta, StoryObj } from "@storybook/vue3-vite";
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
};

export default meta;
