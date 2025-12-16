import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Link from "./Link.vue";

const meta = {
	title: "Action/Action Link",
	component: Link,
	args: { default: "Action Link" },
} satisfies Meta<typeof Link>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { default: "Action Link" },
};

export default meta;
