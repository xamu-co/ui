import { describe, it, expect, vi } from "vitest";

import { eFormType } from "@open-xamu-co/ui-common-enums";

import { FormInput } from "../input";

describe("FormInput", () => {
	const userNameInput = new FormInput<string>({
		name: "userName",
		type: eFormType.TEXT,
		title: "User name",
		placeholder: "Enter user name",
		values: ["John Doe"],
		meta: { status: "pending", count: 1 },
	});

	it("should instantiate a FormInput correctly", () => {
		expect(userNameInput.name).toBe("userName");
		expect(userNameInput.type).toBe(eFormType.TEXT);
		expect(userNameInput.title).toBe("User name");
		expect(userNameInput.placeholder).toBe("Enter user name");
		expect(userNameInput.values).toEqual(["John Doe"]);
		expect(userNameInput.meta).toEqual({
			status: "pending",
			count: 1,
			actionSlotName: "inputActionsUserName",
		});
	});

	it("should clone FormInput with correct properties", () => {
		const cloned = userNameInput.clone();

		expect(cloned.name).toBe("userName");
		expect(cloned.type).toBe(eFormType.TEXT);
		expect(cloned.title).toBe("User name");
		expect(cloned.placeholder).toBe("Enter user name");
		expect(cloned.values).toEqual(["John Doe"]);
		expect(cloned.meta).toEqual({
			status: "pending",
			count: 1,
			actionSlotName: "inputActionsUserName",
		});
	});

	it("should isolate values array between original and cloned FormInput", () => {
		const cloned = userNameInput.clone();

		// Mutate cloned values
		cloned.values[0] = "Jane Doe";
		cloned.values.push("Hank Aaron");

		// Assert original values are NOT affected
		expect(userNameInput.values).toEqual(["John Doe"]);
		expect(cloned.values).toEqual(["Jane Doe", "Hank Aaron"]);
	});

	it("should isolate meta object between original and cloned FormInput", () => {
		const cloned = userNameInput.clone();

		// Mutate cloned meta properties
		cloned.meta.status = "success";
		cloned.meta.count = 2;
		cloned.meta.new_prop = "test";

		// Assert original meta is NOT affected
		expect(userNameInput.meta).toEqual({
			status: "pending",
			count: 1,
			actionSlotName: "inputActionsUserName",
		});
		expect(cloned.meta).toEqual({
			status: "success",
			count: 2,
			actionSlotName: "inputActionsUserName",
			new_prop: "test",
		});
	});

	it("should clone and isolate defaults array if present", () => {
		const locationInput = new FormInput({
			name: "location",
			type: eFormType.LOCATION,
			defaults: [{ type: eFormType.TEXT }, { type: eFormType.TEXT }],
			values: [["CityVal", "StateVal"]],
		});

		const cloned = locationInput.clone();

		// Mutate cloned defaults array
		cloned.defaults?.push({ type: eFormType.TEXT });
		// Assert original defaults array is NOT affected
		expect(locationInput.defaults?.length).toBe(2);
		expect(cloned.defaults?.length).toBe(3);
	});

	it("should apply overrides when cloning", () => {
		const cloned = userNameInput.clone({
			placeholder: "New placeholder",
			required: true,
			values: ["Jane Doe"],
		});

		expect(cloned.name).toBe("userName");
		expect(cloned.placeholder).toBe("New placeholder");
		expect(cloned.required).toBe(true);
		expect(cloned.values).toEqual(["Jane Doe"]);
		expect(userNameInput.values).toEqual(["John Doe"]);
	});

	it("should retain onUpdatedValues hook when cloning", () => {
		const updateHook = vi.fn((vals) => vals);
		const cloned = userNameInput.clone({}, updateHook);

		cloned.values = ["Jane Doe"];

		expect(updateHook).toHaveBeenCalled();
	});

	it("should allow overriding onUpdatedValues hook when cloning", () => {
		const originalHook = vi.fn((vals) => vals);
		const overrideHook = vi.fn((vals) => vals);
		const userNameInputWithHook = userNameInput.clone({}, originalHook);
		const cloned = userNameInputWithHook.clone(undefined, overrideHook);

		cloned.values = ["Jane Doe"];

		expect(originalHook).not.toHaveBeenCalled();
		expect(overrideHook).toHaveBeenCalled();
	});

	it("should call onUpdatedValues hook when cloning with updated values", () => {
		const updateHook = vi.fn((vals) => vals);
		const userNameInputWithHook = userNameInput.clone({}, updateHook);

		// Clone with overrides containing new values
		const cloned = userNameInputWithHook.clone({ values: ["Jane Doe"] });

		expect(updateHook).toHaveBeenCalledWith(["Jane Doe"]);
		expect(cloned.values).toEqual(["Jane Doe"]);
	});

	it("should not call onUpdatedValues hook when cloning without value changes", () => {
		const updateHook = vi.fn((vals) => vals);
		const userNameInputWithHook = userNameInput.clone({}, updateHook);

		// Clone with overrides that do NOT change values
		userNameInputWithHook.clone({ title: "New Title" });

		expect(updateHook).not.toHaveBeenCalled();
	});

	it("should handle async onUpdatedValues hook when updating values", async () => {
		const asyncHook = vi.fn(async (vals: string[]) => vals.map((v) => v.toUpperCase()));
		const input = new FormInput<string>({ name: "code", type: eFormType.TEXT }, asyncHook);

		input.values = ["hello"];
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(asyncHook).toHaveBeenCalledWith(["hello"]);
		expect(input.values).toEqual(["HELLO"]);
	});

	it("should manage values with addValue and removeValue within min and max bounds", () => {
		const tagInput = new FormInput<string>({
			name: "tags",
			type: eFormType.TEXT,
			min: 1,
			max: 3,
			values: ["Tag1"],
		});

		// Add values up to max
		tagInput.addValue("Tag2");
		expect(tagInput.values).toEqual(["Tag1", "Tag2"]);

		tagInput.addValue("Tag3");
		expect(tagInput.values).toEqual(["Tag1", "Tag2", "Tag3"]);

		// Cannot add past max
		tagInput.addValue("Tag4");
		expect(tagInput.values).toEqual(["Tag1", "Tag2", "Tag3"]);

		// Remove value down to min
		tagInput.removeValue(2);
		expect(tagInput.values).toEqual(["Tag1", "Tag2"]);

		tagInput.removeValue(1);
		expect(tagInput.values).toEqual(["Tag1"]);

		// Cannot remove below min
		tagInput.removeValue(0);
		expect(tagInput.values).toEqual(["Tag1"]);
	});

	it("should autoset values for required choice or select inputs when values are empty", () => {
		const choiceInput = new FormInput({
			name: "choice",
			type: eFormType.CHOICE,
			required: true,
			options: [
				{ value: "opt1", alias: "Option 1" },
				{ value: "opt2", alias: "Option 2" },
			],
		});

		expect(choiceInput.values).toEqual(["opt1"]);
	});

	it("should trigger rerender when updating options", () => {
		const rerenderMock = vi.fn();
		const selectInput = new FormInput(
			{
				name: "select",
				type: eFormType.SELECT,
				required: true,
			},
			undefined,
			rerenderMock
		);

		selectInput.options = [
			{ value: "valA", alias: "A" },
			{ value: "valB", alias: "B" },
		];

		expect(selectInput.options.length).toBe(2);
		expect(rerenderMock).toHaveBeenCalled();
	});

	it("should generate default values for complex types and clamp min/max bounds", () => {
		const locationInput = new FormInput({
			name: "location",
			type: eFormType.LOCATION,
		});

		expect(locationInput.values).toEqual([["", "", ""]]);

		const phoneInput = new FormInput({
			name: "phone",
			type: eFormType.CELLPHONE,
		});

		expect(phoneInput.values).toEqual([["", ""]]);

		const boolInput = new FormInput({
			name: "active",
			type: eFormType.BOOLEAN,
		});

		expect(boolInput.values).toEqual([false]);

		// Clamping max when max < min
		const clampedInput = new FormInput({
			name: "clamped",
			type: eFormType.TEXT,
			min: 5,
			max: 2,
		});

		expect(clampedInput.max).toBe(5);
	});

	it("should compare FormInput instances with isEqual and export plain object representation", () => {
		const inputA = new FormInput({
			name: "test",
			type: eFormType.TEXT,
			title: "Title",
			required: true,
		});
		const inputB = new FormInput({
			name: "test",
			type: eFormType.TEXT,
			title: "Title",
			required: true,
		});
		const inputC = new FormInput({
			name: "test",
			type: eFormType.TEXT,
			title: "Different Title",
			required: true,
		});

		expect(inputA.isEqual(inputB)).toBe(true);
		expect(inputA.isEqual(inputC)).toBe(false);

		const plainObj = FormInput.getObject(inputA);

		expect(plainObj).toEqual({
			required: true,
			type: eFormType.TEXT,
			options: [],
			placeholder: "",
			icon: undefined,
			autocomplete: undefined,
			min: 1,
			max: 9e9,
			name: "test",
			values: [""],
			defaults: undefined,
			title: "Title",
			multiple: false,
			unique: true,
		});
	});
});
