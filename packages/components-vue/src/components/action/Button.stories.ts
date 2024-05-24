import type { Meta, StoryObj } from "@storybook/vue3";

import ButtonComponent from "./Button.vue";
import { eColors } from "@open-xamu-co/ui-common-enums";

const meta = {
	title: "Action/Action Button",
	component: ButtonComponent as Record<keyof typeof ButtonComponent, unknown>,
	args: { default: "Action Button" },
} satisfies Meta<typeof ButtonComponent>;

type Story = StoryObj<typeof ButtonComponent>;

export const Button: Story = {
	args: { default: "Action Button" },
};

export const ButtonIsActiveWithAlert: Story = {
	args: { default: "Button with alert", active: true, alert: true },
};

export const ButtonAsY: Story = {
	args: { default: "⋮", y: true, theme: eColors.DANGER },
};

export const ButtonAsYIsActiveWithAlert: Story = {
	args: { default: "⋮", y: true, theme: eColors.DANGER, active: true, alert: true },
};

export default meta;
