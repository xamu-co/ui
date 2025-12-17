import type { Meta, StoryObj } from "@storybook/vue3-vite";

import CollapseSimple from "./Simple.vue";

const meta: Meta<typeof CollapseSimple> = {
	title: "Collapse",
	component: CollapseSimple,
	args: { title: 'Toggle "Collapse" contents', default: "Collapse contents" },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {
		title: "Toggle contents",
		default:
			"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime explicabo neque in odio, adipisci fugiat eos consectetur mollitia repellat eveniet possimus pariatur voluptatum sapiente, quae tempora excepturi quo atque enim.",
	},
};

export default meta;
