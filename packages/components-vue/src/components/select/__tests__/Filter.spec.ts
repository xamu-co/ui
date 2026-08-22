import { describe, it, expect, vi, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import type { iFormOption } from "@open-xamu-co/ui-common-types";

import SelectFilter from "../Filter.vue";

/** Polyfill matchMedia for jsdom environment used by DropdownSimple / useBrowser */
beforeAll(() => {
	if (typeof window !== "undefined" && !window.matchMedia) {
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
	}
});

/** Helper to wait for async useAsyncDataFn handlers & debounce timers */
async function flushAsync(ms = 350) {
	await new Promise((resolve) => setTimeout(resolve, ms));
	await nextTick();
}

describe("SelectFilter", () => {
	const options: iFormOption[] = [
		{ value: "TITLE", alias: "Title Option" },
		{ value: "LONG_TEXT", alias: "Long Text Option" },
		{ value: "SHORT_TEXT", alias: "Short Text Option" },
	];

	it("renders correctly with default props", async () => {
		const wrapper = mount(SelectFilter, { props: { options: ["Single option"] } });

		await flushAsync();

		const input = wrapper.find("input[role='combobox']");

		expect(input.exists()).toBe(true);
		expect(input.attributes("autocomplete")).toBe("off");
	});

	it("renders dropdown menu with options mapped to value or alias", async () => {
		const wrapper = mount(SelectFilter, { props: { options, placeholder: "Filter items" } });

		await flushAsync();

		const dropdownMenu = wrapper.find("nav.dropdown-item");

		expect(dropdownMenu.exists()).toBe(true);

		const optionsElements = dropdownMenu.findAll("li");

		expect(optionsElements.length).toBeGreaterThan(0);
	});

	it("displays option alias in input when valid modelValue is provided", async () => {
		const wrapper = mount(SelectFilter, { props: { options, modelValue: "TITLE" } });

		await flushAsync();

		const input = wrapper.find("input[role='combobox']");

		expect((input.element as HTMLInputElement).value).toBe("Title Option");
	});

	it("renders reset button when modelValue is set and multiple options exist", async () => {
		const wrapper = mount(SelectFilter, { props: { options, modelValue: "TITLE" } });

		await flushAsync();

		const resetButton = wrapper.findComponent({ name: "ActionLink" });

		expect(resetButton.exists()).toBe(true);
	});

	it("emits update:model-value with empty string when reset button is clicked", async () => {
		const wrapper = mount(SelectFilter, { props: { options, modelValue: "TITLE" } });

		await flushAsync();

		const resetButton = wrapper.findComponent({ name: "ActionLink" });

		expect(resetButton.exists()).toBe(true);
		await resetButton.trigger("click");
		expect(wrapper.emitted("update:model-value")?.[0]).toEqual([""]);
	});

	it("emits update:model-value when an option in the dropdown overlay is clicked", async () => {
		const wrapper = mount(SelectFilter, { props: { options, modelValue: "" } });

		await flushAsync();

		const actionLinks = wrapper.findAllComponents({ name: "ActionLink" });
		const optionLink = actionLinks.find((link) => link.text().includes("Title Option"));

		expect(optionLink?.exists()).toBe(true);
		await optionLink?.trigger("click");
		expect(wrapper.emitted("update:model-value")?.[0]).toEqual(["TITLE"]);
	});

	it("disables input when modelValue is set and valid", async () => {
		const wrapper = mount(SelectFilter, { props: { options, modelValue: "TITLE" } });

		await flushAsync();

		const input = wrapper.find("input[role='combobox']");

		expect((input.element as HTMLInputElement).disabled).toBe(true);
	});

	it("disables input and controls when disabled prop is true", async () => {
		const wrapper = mount(SelectFilter, { props: { options, disabled: true } });

		await flushAsync();

		const input = wrapper.find("input[role='combobox']");

		expect((input.element as HTMLInputElement).disabled).toBe(true);
	});

	it("marks field as invalid when invalid prop is true", async () => {
		const wrapper = mount(SelectFilter, { props: { options, invalid: true } });

		await flushAsync();

		const inputText = wrapper.findComponent({ name: "InputText" });

		expect(inputText.props("invalid")).toBe(true);
	});

	it("supports custom options loader function", async () => {
		const loaderFn = vi.fn().mockResolvedValue([
			{ value: "async1", alias: "Async One" },
			{ value: "async2", alias: "Async Two" },
		]);

		mount(SelectFilter, { props: { options: loaderFn, modelValue: "async1" } });
		await flushAsync();
		expect(loaderFn).toHaveBeenCalled();
	});
});
