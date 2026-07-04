import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, expect, waitFor } from "storybook/test";

import InputCountriesAPI from "./InputCountriesAPI.vue";

const meta: Meta<typeof InputCountriesAPI> = {
	title: "Form/Input Countries API",
	component: InputCountriesAPI,
	args: {
		model: ["CO", "VAC", "Cali"],
	},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { InputCountriesAPI },
		setup() {
			return { args };
		},
		template: `
			<InputCountriesAPI v-bind="args" v-slot="{ statesReq, citiesReq }">
				<div data-testid="resolved-content">
					States count: {{ statesReq?.content?.length ?? 'undefined' }}
					Cities count: {{ citiesReq?.content?.length ?? 'undefined' }}
					States loading: {{ statesReq?.loading }}
					Cities loading: {{ citiesReq?.loading }}
					States error: {{ statesReq?.errors ? String(statesReq.errors) : 'none' }}
					Cities error: {{ citiesReq?.errors ? String(citiesReq.errors) : 'none' }}
				</div>
			</InputCountriesAPI>
		`,
	}),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(() => {
			const content = canvas.getByTestId("resolved-content");

			expect(content).toHaveTextContent("States count: 1");
			expect(content).toHaveTextContent("Cities count: 1");
		});
	},
};

export default meta;
