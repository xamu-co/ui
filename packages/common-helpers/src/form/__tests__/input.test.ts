import { describe, it, expect, vi } from "vitest";

import { eFormType } from "@open-xamu-co/ui-common-enums";

import { FormInput } from "../input";

describe("FormInput", () => {
	const usernameInput = new FormInput<string>({
		name: "username",
		type: eFormType.TEXT,
		title: "Username",
		placeholder: "Enter username",
		values: ["John Doe"],
		meta: { status: "pending", count: 1 },
	});

	it("should instantiate a FormInput correctly", () => {
		expect(usernameInput.name).toBe("username");
		expect(usernameInput.type).toBe(eFormType.TEXT);
		expect(usernameInput.title).toBe("Username");
		expect(usernameInput.placeholder).toBe("Enter username");
		expect(usernameInput.values).toEqual(["John Doe"]);
		expect(usernameInput.meta).toEqual({ status: "pending", count: 1 });
	});

	it("should clone FormInput with correct properties", () => {
		const cloned = usernameInput.clone();

		expect(cloned.name).toBe("username");
		expect(cloned.type).toBe(eFormType.TEXT);
		expect(cloned.title).toBe("Username");
		expect(cloned.placeholder).toBe("Enter username");
		expect(cloned.values).toEqual(["John Doe"]);
		expect(cloned.meta).toEqual({ status: "pending", count: 1 });
	});

	it("should isolate values array between original and cloned FormInput", () => {
		const cloned = usernameInput.clone();

		// Mutate cloned values
		cloned.values[0] = "Jane Doe";
		cloned.values.push("Hank Aaron");

		// Assert original values are NOT affected
		expect(usernameInput.values).toEqual(["John Doe"]);
		expect(cloned.values).toEqual(["Jane Doe", "Hank Aaron"]);
	});

	it("should isolate meta object between original and cloned FormInput", () => {
		const cloned = usernameInput.clone();

		// Mutate cloned meta properties
		cloned.meta.status = "success";
		cloned.meta.count = 2;
		cloned.meta.new_prop = "test";

		// Assert original meta is NOT affected
		expect(usernameInput.meta).toEqual({ status: "pending", count: 1 });
		expect(cloned.meta).toEqual({ status: "success", count: 2, new_prop: "test" });
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
		const cloned = usernameInput.clone({
			placeholder: "New placeholder",
			required: true,
			values: ["Jane Doe"],
		});

		expect(cloned.name).toBe("username");
		expect(cloned.placeholder).toBe("New placeholder");
		expect(cloned.required).toBe(true);
		expect(cloned.values).toEqual(["Jane Doe"]);
		expect(usernameInput.values).toEqual(["John Doe"]);
	});

	it("should retain onUpdatedValues hook when cloning", () => {
		const updateHook = vi.fn((vals) => vals);
		const cloned = usernameInput.clone({}, updateHook);

		cloned.values = ["Jane Doe"];

		expect(updateHook).toHaveBeenCalled();
	});

	it("should allow overriding onUpdatedValues hook when cloning", () => {
		const originalHook = vi.fn((vals) => vals);
		const overrideHook = vi.fn((vals) => vals);
		const usernameInputWithHook = usernameInput.clone({}, originalHook);
		const cloned = usernameInputWithHook.clone(undefined, overrideHook);

		cloned.values = ["Jane Doe"];

		expect(originalHook).not.toHaveBeenCalled();
		expect(overrideHook).toHaveBeenCalled();
	});
});
