import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { within, userEvent, expect } from "storybook/test";

import DropdownSimple from "./Simple.vue";
import ActionButton from "../action/Button.vue";

const meta: Meta<typeof DropdownSimple> = {
	title: "Dropdown",
	component: DropdownSimple,
	args: {
		invertTheme: true,
	},
	tags: ["test"],
};

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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText("Open dropdown");

		expect(trigger).toBeInTheDocument();
		// Click to open dropdown
		await userEvent.click(trigger);

		// Dropdown menu content should be visible
		const option = canvas.getByText("First option");

		expect(option).toBeInTheDocument();

		// On desktop viewport, it should NOT render inside a modal dialog element
		const dialog = canvasElement.querySelector("dialog");

		expect(dialog).toBeNull();
		expect(option.closest("dialog")).toBeNull();
	},
};

export const AsModal: Story = {
	globals: {
		viewport: { value: "mobile1", isRotated: false },
	},
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText("Open dropdown");

		expect(trigger).toBeInTheDocument();
		// Click trigger to toggle modal on mobile viewport
		await userEvent.click(trigger);

		// Modal dialog element should be present and rendered
		const dialog = canvasElement.querySelector("dialog");

		expect(dialog).toBeInTheDocument();

		// Option content must be rendered INSIDE the modal dialog
		const optionInDialog = within(dialog!).getByText("First option");

		expect(optionInDialog).toBeInTheDocument();
		expect(optionInDialog.closest("dialog")).toBe(dialog);
	},
};

export default meta;
