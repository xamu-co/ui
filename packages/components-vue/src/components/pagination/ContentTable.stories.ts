import type { StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import type { GenericMeta } from "../../types/storybook";

import PaginationContentTable from "./ContentTable.vue";
import { expect, waitFor, userEvent, within } from "storybook/test";

import type { tOrderBy, iPagination, iPage, iGetPage } from "@open-xamu-co/ui-common-types";

interface iSector {
	id: number;
	name: string;
	description: string;
	categories?: string[];
}

async function page(_params?: iPagination) {
	const response: iPage<iSector, number> = {
		edges: [
			{
				cursor: 1,
				node: {
					id: 1,
					name: "Sector Original 1",
					description: "Descripción Original 1",
				},
			},
			{
				cursor: 2,
				node: {
					id: 2,
					name: "Sector Original 2",
					description: "Descripción Original 2",
				},
			},
		],
		pageInfo: {
			pageNumber: 1,
			hasNextPage: false,
			hasPreviousPage: false,
		},
		totalCount: 2,
	};

	return Promise.resolve(response);
}

const meta: GenericMeta<typeof PaginationContentTable> = {
	title: "Pagination/Pagination ContentTable",
	component: PaginationContentTable,
	args: {},
};

type Story = StoryObj<typeof meta>;

const mockedPage: iGetPage<any> = () => {
	return Promise.resolve({
		edges: [],
		pageInfo: {
			hasNextPage: false,
			hasPreviousPage: false,
		},
		totalCount: 0,
	});
};

export const Sample: Story = {
	args: {
		url: "any:path",
		page: mockedPage,
	},
};

export const Data: Story = {
	args: {
		url: "any:path",
	},
	render: (args) => ({
		components: { PaginationContentTable },
		setup() {
			const sort = ref<tOrderBy>();

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
			function updateNode(node: iSector) {
				const updatedNode: iSector = {
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
