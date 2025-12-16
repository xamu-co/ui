import type { StoryObj } from "@storybook/vue3-vite";

import type { GenericMeta } from "../../types/storybook";

import Simple from "./Simple.vue";

const meta = {
	title: "Value/Value Simple",
	component: Simple,
	args: { value: "https://picsum.photos/seed/45465/100/100" },
} satisfies GenericMeta<typeof Simple>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { value: "https://picsum.photos/seed/45465/100/100" },
};

export default meta;
