import type { Meta, StoryObj } from "@storybook/vue3";

import Simple from "./Simple.vue";

const meta = {
	title: "Value/Value Simple",
	component: Simple as Record<keyof typeof Simple, unknown>,
	args: { value: "https://picsum.photos/seed/45465/100/100" },
} satisfies Meta<typeof Simple>;

type Story = StoryObj<typeof Simple>;

export const Sample: Story = {
	args: { value: "https://picsum.photos/seed/45465/100/100" },
};

export default meta;
