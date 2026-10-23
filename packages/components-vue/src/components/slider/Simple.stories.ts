import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { userEvent, expect } from "storybook/test";

import SliderSimple from "./Simple.vue";
import { useHelpers } from "../../composables/utils.js";
import { useI18n } from "@open-xamu-co/ui-common-helpers";

const meta: Meta<typeof SliderSimple> = {
	title: "Slider/Slider Simple",
	component: SliderSimple,
	args: {
		controls: "full",
		animate: true,
		intervalDuration: 3000,
	},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { SliderSimple },
		setup() {
			return { args };
		},
		template: `
			<SliderSimple v-bind="args" style="max-width: 500px;">
				<div style="height: 100px; background: #e0f2fe; flex: 0 0 100%; display: flex; align-items: center; justify-content: center;">Slide 1</div>
				<div style="height: 100px; background: #dcfce7; flex: 0 0 100%; display: flex; align-items: center; justify-content: center;">Slide 2</div>
				<div style="height: 100px; background: #fef9c3; flex: 0 0 100%; display: flex; align-items: center; justify-content: center;">Slide 3</div>
			</SliderSimple>
		`,
	}),
	play: async ({ canvasElement }) => {
		// Wait for slider to finish mounting (loading indicator resolves)
		// We hover over the slider to pause auto-animation
		const sliderElement = canvasElement.querySelector(".xamu-slider");
		const { t } = useHelpers(useI18n);

		expect(sliderElement).toBeInTheDocument();

		if (sliderElement) {
			await userEvent.hover(sliderElement);
			await userEvent.unhover(sliderElement);
		}

		// Click on slide-2 dot button
		const dot2 = canvasElement.querySelector("#slide-2");

		if (dot2) await userEvent.click(dot2);

		// Click on next button
		const nextButton =
			canvasElement.querySelector(`[aria-label='next']`) ||
			canvasElement.querySelector(`[aria-label='${t("next")}']`);

		if (nextButton) await userEvent.click(nextButton);

		// Click on previous button
		const prevButton =
			canvasElement.querySelector("[aria-label='previous']") ||
			canvasElement.querySelector(`[aria-label='${t("previous")}']`);

		if (prevButton) await userEvent.click(prevButton);
	},
};

export default meta;
