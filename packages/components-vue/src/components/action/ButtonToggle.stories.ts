import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import ButtonToggle from "./ButtonToggle.vue";
import IconFa from "../icon/Fa.vue";

const meta = {
	title: "Action/Action Button Toggle",
	component: ButtonToggle,
	args: { default: "Action Button Toggle" },
} satisfies Meta<typeof ButtonToggle>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { default: "Action Button Toggle" },
};

export const Active: Story = {
	args: { default: "Active button Toggle", active: true },
};

export const WithIcon: Story = {
	render: (args) => ({
		components: { ButtonToggle, IconFa },
		setup() {
			const model = ref(false);

			function toggle() {
				model.value = !model.value;
			}

			return { args, model, toggle };
		},
		template: `
			<ButtonToggle v-bind="args" :active="model" @click="toggle">
				<IconFa name="eye" force-regular />
				<IconFa name="eye" />
			</ButtonToggle>
		`,
	}),
	args: { round: true },
};

export default meta;
