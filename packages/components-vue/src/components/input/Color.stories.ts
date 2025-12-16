import type { Meta, StoryObj } from "@storybook/vue3-vite";

import InputColor from "./Color.vue";
import { ref } from "vue";

const meta = {
	title: "Input/Input Color",
	component: InputColor,
	args: {},
} satisfies Meta<typeof InputColor>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { InputColor },
		setup() {
			const model = ref("#000000");

			return { args, model };
		},
		template: '<InputColor v-bind="args" v-model="model" />',
	}),
};

export default meta;
