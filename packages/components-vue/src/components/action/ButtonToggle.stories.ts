import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import ActionButtonToggle from "./ButtonToggle.vue";
import IconFa from "../icon/Fa.vue";

const meta: Meta<typeof ActionButtonToggle> = {
	title: "Action/Action Button Toggle",
	component: ActionButtonToggle,
	args: { default: "Action Button Toggle" },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { default: "Action Button Toggle" },
};

export const Active: Story = {
	args: { default: "Active button Toggle", active: true },
};

export const WithIcon: Story = {
	render: (args) => ({
		components: { ActionButtonToggle, IconFa },
		setup() {
			const model = ref(false);

			function toggle() {
				model.value = !model.value;
			}

			return { args, model, toggle };
		},
		template: `
			<ActionButtonToggle v-bind="args" :active="model" @click="toggle">
				<IconFa name="eye" force-regular />
				<IconFa name="eye" />
			</ActionButtonToggle>
		`,
	}),
	args: { round: true },
};

export default meta;
