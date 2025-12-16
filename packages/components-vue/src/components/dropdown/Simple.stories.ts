import type { Meta, StoryObj } from "@storybook/vue3-vite";

import DropdownSimple from "./Simple.vue";
import ActionButton from "../action/Button.vue";

const meta = {
	title: "Dropdown",
	component: DropdownSimple,
	args: {
		invertTheme: true,
	},
} satisfies Meta<typeof DropdownSimple>;

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { DropdownSimple, ActionButton },
		setup() {
			return { args };
		},
		template: `
		<div class="--minHeightVh-30 --flx --flxColumn --flx-start">
			<DropdownSimple v-bind="args">
				<template #toggle="{ setModel }">
					<ActionButton @click="setModel">Open dropdown</ActionButton>
				</template>
				<template #default>
					<ul class="--txtColor">
						<li>First option</li>
						<li>Second option</li>
						<li>Third option</li>
					</ul>
				</template>
			</DropdownSimple>
		</div>`,
	}),
};

export default meta;
