import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import InputColor from "./Color.vue";

const meta: Meta<typeof InputColor> = {
	title: "Input/Input Color",
	component: InputColor,
	args: {},
};

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
