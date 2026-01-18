import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import InputCode from "./Code.vue";

const meta: Meta<typeof InputCode> = {
	title: "Input/Input Code",
	component: InputCode,
	args: {},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { InputCode },
		setup() {
			const model = ref("");

			return { args, model };
		},
		template: '<InputCode v-bind="args" v-model="model" />',
	}),
	args: {
		placeholder: "Enter your code",
	},
};

export default meta;
