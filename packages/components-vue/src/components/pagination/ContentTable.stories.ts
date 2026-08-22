import type { StoryObj } from "@storybook/vue3-vite";
import { expect, waitFor, userEvent, within } from "storybook/test";
import { ref } from "vue";

import type { GenericMeta } from "../../types/storybook";
import largeNodes from "../table/nodes.json" with { type: "json" };

import PaginationContentTable from "./ContentTable.vue";

import type { tOrderBy, iGetPage } from "@open-xamu-co/ui-common-types";

function makePage(nodes?: Record<string, any>[]): iGetPage<Record<string, any>, number> {
	nodes ||= [
		{
			id: 1,
			name: "Sector Original 1",
			description: "Descripción Original 1",
		},
		{
			id: 2,
			name: "Sector Original 2",
			description: "Descripción Original 2",
		},
	];

	return function () {
		return Promise.resolve({
			edges: nodes.map((node, index) => ({ cursor: index + 1, node })),
			pageInfo: {
				pageNumber: 1,
				hasNextPage: false,
				hasPreviousPage: false,
			},
			totalCount: 2,
		});
	};
}

const meta: GenericMeta<typeof PaginationContentTable> = {
	title: "Pagination/Pagination ContentTable",
	component: PaginationContentTable,
	args: {},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: {
		url: "sample:path",
		page: makePage(),
	},
};

export const Data: Story = {
	args: {
		url: "data:path",
	},
	render: (args) => ({
		components: { PaginationContentTable },
		setup() {
			const sort = ref<tOrderBy>();
			const page = makePage();

			return { args, sort, page };
		},
		template: `<PaginationContentTable v-bind="args" :page="page" />`,
	}),
};

export const LargeData: Story = {
	args: {
		url: "large-data:path",
	},
	render: (args) => ({
		components: { PaginationContentTable },
		setup() {
			const sort = ref<tOrderBy>();
			const page = makePage(largeNodes);

			return { args, sort, page };
		},
		template: `<PaginationContentTable v-bind="args" :page="page" />`,
	}),
};

export const Hydration: Story = {
	args: {
		url: "test:hydration:path",
		swal: {
			createdTitle: "Creado",
			createdText: "El registro fue creado",
		},
	},
	render: (args) => ({
		components: { PaginationContentTable },
		setup() {
			const page = makePage();

			function updateNode(node: Record<string, any>) {
				const updatedNode: Record<string, any> = {
					...node,
					name: `${node.name} (Hydrated)`,
					description: "Description Updated Via Hydrate",
				};

				// Return promise with fresh data for hydration
				return Promise.resolve([updatedNode]);
			}

			return { args: { ...args, tableProps: { updateNode } }, page };
		},
		template: `<PaginationContentTable v-bind="args" :page="page" />`,
	}),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Wait for table to render with initial data
		await waitFor(() => {
			expect(canvas.getByText("Sector Original 1")).toBeInTheDocument();
		});

		// Find update (edit) buttons
		const updateButtons = canvasElement.querySelectorAll(
			"button[title='Actualizar'], button[aria-label='Actualizar'], button[data-tooltip='Actualizar'], button .fa-pencil"
		);
		const editButton = updateButtons[0]?.closest("button") || updateButtons[0];

		if (editButton) {
			await userEvent.click(editButton);
		}

		// Validate that table cell reactively hydrated with new text
		await waitFor(
			() => {
				expect(canvas.getByText("Sector Original 1 (Hydrated)")).toBeInTheDocument();
			},
			{ timeout: 5000 }
		);
	},
};

export default meta;
