import type { Meta, StoryObj } from "@storybook/vue3";

import FormWithFetch from "./FormWithFetch.vue";

const meta = {
	title: "Screens/Form with fetch",
	component: FormWithFetch as Record<keyof typeof FormWithFetch, unknown>,
	args: {},
	tags: ["!autodocs"],
} satisfies Meta<typeof FormWithFetch>;

type Story = StoryObj<typeof FormWithFetch>;

export const Sample: Story = {
	args: {},
};

export default meta;
