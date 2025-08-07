import type { Meta, StoryObj } from "@storybook/vue3";
import { ref, watch } from "vue";

import File from "./File.vue";

const meta = {
	title: "Input/Input File",
	component: File as Record<keyof typeof File, unknown>,
	args: { modelValue: [] },
} satisfies Meta<typeof File>;

type Story = StoryObj<typeof File>;

export const Sample: Story = {
	render: (args) => ({
		components: { File },
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
		template: '<File v-bind="args" v-model="model" />',
	}),
	args: { modelValue: [] },
};

export default meta;
