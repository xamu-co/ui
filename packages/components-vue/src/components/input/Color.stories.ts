import type { Meta, StoryObj } from "@storybook/vue3";

import InputColor from "./Color.vue";
import { ref } from "vue";

const meta = {
	title: "Input/Input Color",
	component: InputColor as Record<keyof typeof InputColor, unknown>,
	args: {},
} satisfies Meta<typeof InputColor>;

type Story = StoryObj<typeof InputColor>;

export const Sample: Story = {
	render: (args) => ({
		components: { InputColor },
		setup() {
			const model = ref();

			return { args, model };
		},
		template: '<InputColor v-bind="args" v-model="model" />',
	}),
};

export default meta;
