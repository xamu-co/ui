import type { Meta, StoryObj } from "@storybook/vue3-vite";

import InputTime from "./Time.vue";

const meta: Meta<typeof InputTime> = {
	title: "Input/Input Time",
	component: InputTime,
	args: { modelValue: "", placeholder: "Select date/time" },
};

type Story = StoryObj<typeof meta>;

export const DateSample: Story = {
	args: { type: "date" },
};

export const DateTimeSample: Story = {
	args: { type: "datetime-local" },
};

export const TimeSample: Story = {
	args: { type: "time" },
};

export default meta;
