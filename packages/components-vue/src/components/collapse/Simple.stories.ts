import type { Meta, StoryObj } from "@storybook/vue3";

import Simple from "./Simple.vue";

const meta = {
	title: "Collapse",
	component: Simple as Record<keyof typeof Simple, unknown>,
	args: { title: 'Toggle "Collapse" contents', default: "Collapse contents" },
} satisfies Meta<typeof Simple>;

type Story = StoryObj<typeof Simple>;

export const Sample: Story = {
	args: {
		title: "Toggle contents",
		default:
			"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime explicabo neque in odio, adipisci fugiat eos consectetur mollitia repellat eveniet possimus pariatur voluptatum sapiente, quae tempora excepturi quo atque enim.",
	},
};

export default meta;
