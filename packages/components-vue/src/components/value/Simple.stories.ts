import type { StoryObj } from "@storybook/vue3-vite";

import type { GenericMeta } from "../../types/storybook";

import ValueSimple from "./Simple.vue";

const meta: GenericMeta<typeof ValueSimple> = {
	title: "Value/Value Simple",
	component: ValueSimple,
	args: { value: "https://picsum.photos/seed/45465/100/100" },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { value: "https://picsum.photos/seed/45465/100/100" },
};

export default meta;
