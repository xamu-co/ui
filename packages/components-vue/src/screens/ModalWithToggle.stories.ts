import type { Meta, StoryObj } from "@storybook/vue3";

import ModalWithToggle from "./ModalWithToggle.vue";

const meta = {
	title: "Screens/Modal with Toggle",
	component: ModalWithToggle as Record<keyof typeof ModalWithToggle, unknown>,
	args: {},
	tags: ["!autodocs"],
} satisfies Meta<typeof ModalWithToggle>;

type Story = StoryObj<typeof ModalWithToggle>;

export const Sample: Story = {
	args: {},
};

export default meta;
