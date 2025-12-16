import { type Meta, type StoryObj } from "@storybook/vue3-vite";
import { within, userEvent, expect } from "storybook/test";
import { computed, ref } from "vue";

import { eColors } from "@open-xamu-co/ui-common-enums";

import ButtonComponent from "./Button.vue";

const meta = {
	title: "Action/Action Button",
	component: ButtonComponent,
	args: { default: "Action Button" },
	tags: ["stable"],
} satisfies Meta<typeof ButtonComponent>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {},
	render: (args) => ({
		components: { ButtonComponent },
		setup() {
			const times = ref(0);
			const timesText = computed(() => {
				if (!times.value) return args.default;

				if (times.value === 1) return "Clicked once";

				return `Clicked ${times.value} times`;
			});

			function clicked() {
				times.value++;
			}

			return { args, clicked, timesText };
		},
		template: `<ButtonComponent v-bind="args" @click="clicked" >{{ timesText }}</ButtonComponent>`,
	}),
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByText("Action Button");

		// Check if the button is rendered
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("Action Button");

		await userEvent.click(button);

		// Check if the button was updated
		expect(button).toHaveTextContent("Clicked once");
	},
};

export const ActiveWithAlert: Story = {
	args: { default: "Button with alert", active: true, alert: true },
};

export const VerticalDanger: Story = {
	args: { default: "⋮", y: true, theme: eColors.DANGER },
};

export const VerticalDangerActiveWithAlert: Story = {
	args: { default: "⋮", y: true, theme: eColors.DANGER, active: true, alert: true },
};

export default meta;
