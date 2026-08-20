import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, expect, waitFor } from "storybook/test";

import InputCountriesAPI from "./InputCountriesAPI.vue";
import ValueList from "../value/List.vue";

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
		components: { ValueList, InputCountriesAPI },
		setup() {
			return { args };
		},
		template: `
			<InputCountriesAPI v-bind="args" v-slot="{ statesReq, citiesReq }">
				<ValueList :value="{
					statesCount: statesReq?.content?.length,
					citiesCount: citiesReq?.content?.length,
					statesLoading: statesReq?.loading,
					citiesLoading: citiesReq?.loading,
					statesError: statesReq?.errors || 'none',
					citiesError: citiesReq?.errors || 'none',
				}" />
			</InputCountriesAPI>
		`,
	}),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(() => {
			const statesCount = canvas.getByTitle("States Count");
			const citiesCount = canvas.getByTitle("Cities Count");

			expect(statesCount).toHaveTextContent("1");
			expect(citiesCount).toHaveTextContent("1");
		});
	},
};

export default meta;
