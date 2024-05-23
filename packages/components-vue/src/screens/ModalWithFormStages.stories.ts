import type { Meta, StoryObj } from "@storybook/vue3";

import ModalWithFormStages from "./ModalWithFormStages.vue";

const meta = {
	title: "Screens/Modal with Form Stages",
	component: ModalWithFormStages as Record<keyof typeof ModalWithFormStages, unknown>,
	args: {},
	tags: ["!autodocs"],
} satisfies Meta<typeof ModalWithFormStages>;

type Story = StoryObj<typeof ModalWithFormStages>;

export const Sample: Story = {
	args: {},
};

export default meta;
