import type { Meta, StoryObj } from "@storybook/vue3";

import DropdownWithToggle from "./DropdownWithToggle.vue";

const meta = {
	title: "Screens/Dropdown with Toggle",
	component: DropdownWithToggle as Record<keyof typeof DropdownWithToggle, unknown>,
	args: {},
	tags: ["!autodocs"],
} satisfies Meta<typeof DropdownWithToggle>;

type Story = StoryObj<typeof DropdownWithToggle>;

export const Sample: Story = {
	args: {},
};

export default meta;
