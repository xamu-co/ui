import type { Meta, StoryObj } from "@storybook/vue3-vite";

import BoxEditor from "./Editor.vue";
import { ref } from "vue";

const meta: Meta<typeof BoxEditor> = {
	title: "Box/Box Editor",
	component: BoxEditor,
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { BoxEditor },
		setup() {
			const model = ref<string>("");

			return { args, model };
		},
		template: '<BoxEditor v-bind="args" v-model="model" />',
	}),
};

export default meta;
