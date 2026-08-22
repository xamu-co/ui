import { describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";

import TableSimple from "../Simple.vue";

const ValueComplexStub = {
	name: "ValueComplex",
	props: ["value"],
	template: "<span>{{ value?.name ?? value?.displayName ?? value }}</span>",
};

describe("TableSimple", () => {
	const sampleNodes: Record<string, any>[] = [
		{ id: 1, name: "Carlos", role: "admin" },
		{ id: 2, name: "Ana", role: "user" },
		{ id: 3, name: "Juan", role: "user" },
	];

	const mountOptions = {
		global: {
			stubs: {
				ValueComplex: ValueComplexStub,
			},
		},
	};

	it("renders correctly with default nodes", async () => {
		const wrapper = mount(TableSimple, {
			...mountOptions,
			props: { nodes: sampleNodes },
		});

		await flushPromises();

		const rows = wrapper.findAll("tbody tr");

		expect(rows.length).toBe(3);
		expect(wrapper.text()).toContain("Carlos");
		expect(wrapper.text()).toContain("Ana");
		expect(wrapper.text()).toContain("Juan");
	});

	it("allows mapNodes to filter array and produce a different length than props.nodes", async () => {
		const mapNodesSpy = vi.fn((nodes: typeof sampleNodes) => {
			// Filter out carlos, returning an array of length 2 (different from props.nodes.length 3)
			return nodes.filter((node) => node.name !== "Carlos");
		});

		const wrapper = mount(TableSimple, {
			...mountOptions,
			props: {
				nodes: sampleNodes,
				mapNodes: mapNodesSpy,
			},
		});

		await flushPromises();

		// Assert mapNodes was called with the whole array of nodes
		expect(mapNodesSpy).toHaveBeenCalledWith(sampleNodes);

		// Assert rendered rows match filtered length (2)
		const rows = wrapper.findAll("tbody tr");

		expect(rows.length).toBe(2);
		expect(wrapper.text()).not.toContain("Carlos");
		expect(wrapper.text()).toContain("Ana");
		expect(wrapper.text()).toContain("Juan");
	});

	it("supports custom node transformation in mapNodes", async () => {
		const wrapper = mount(TableSimple, {
			...mountOptions,
			props: {
				nodes: sampleNodes,
				mapNodes: (nodes) =>
					nodes.map((node) => ({
						id: node.id,
						displayName: node.name.toUpperCase(),
					})),
			},
		});

		await flushPromises();

		expect(wrapper.text()).toContain("CARLOS");
		expect(wrapper.text()).toContain("ANA");
		expect(wrapper.text()).toContain("JUAN");
	});
});
