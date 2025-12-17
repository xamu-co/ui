import type { StoryObj } from "@storybook/vue3-vite";

import type { GenericMeta } from "../../types/storybook";

import TableSimple from "./Simple.vue";

const nodes = [
	{
		id: 1,
		slug: "jhon-doe",
		firstName: "Jhon Harrison",
		lastName: "Doe Johnson",
		email: "jhsj@xamu.com.co",
		zipCode: "124876",
		pathPhoto: "https://picsum.photos/seed/45465/100/100",
		createdAt: "2024-05-12T03:34:22.408Z",
		updatedAt: "2024-05-12T03:34:22.408Z",
		price: 2443535,
		iva: false,
		reference: "00000001",
		variants: 2,
		visible: true,
		permissions: [
			{ endpoint: "GET_OWN_USER", description: "User can get who he is" },
			{ endpoint: "GET_USER", description: "User can get itself or another user" },
			{ endpoint: "REMOVE_BUSINESS", description: "User can remove their business" },
			{ endpoint: "REMOVE_OFFER", description: "User can remove a offer" },
			{ endpoint: "UPDATE_BUSINESS", description: "User can update their business" },
			{ endpoint: "CREATE_LOCAL", description: "User can create a local" },
			{ endpoint: "UPDATE_LOCAL", description: "User can update a local" },
			{ endpoint: "REMOVE_LOCAL", description: "User can remove a local" },
		],
		category: {
			name: "Labial",
			description: "Aqui van  mis labiales",
			keywords: ["labial", "cuidado facial"],
			createdAt: "2024-09-29T22:14:37.562Z",
			updatedAt: "2024-09-29T22:14:37.562Z",
			possibleVariants: [
				{
					name: "marca labial",
					type: "text",
					values: [
						{ name: "loreal", value: "LOREAL" },
						{ name: "yambal", value: "YAMBAL" },
					],
					createdAt: "2024-09-29T22:13:20.877Z",
					updatedAt: "2024-09-29T22:13:20.877Z",
					id: "possibleVariants/ovXdgBbDFKM6ZAdZSqti",
				},
			],
			id: "categories/YJbSamQ7Jg7lQQ5WTFtp",
		},
		businesses: [],
	},
	{
		id: 2,
		slug: "carla-harrison",
		firstName: "Carla Harrison",
		lastName: "Harrison Johnson",
		email: "carla@xamu.com.co",
		zipCode: "124876",
		pathPhoto: "https://picsum.photos/seed/12345/100/100",
		createdAt: "2024-05-12T03:34:22.408Z",
		updatedAt: "2024-05-12T03:34:22.408Z",
		price: 24456,
		iva: false,
		reference: "00000002",
		variants: 2,
		visible: true,
		permissions: [],
		businesses: [],
	},
];

const subNodes = [
	{
		amount: 6,
		reference: "00000001-00000001",
		createdAt: "2024-09-29T22:20:51.313Z",
		updatedAt: "2024-09-29T22:20:51.313Z",
		id: "variants/8O2IV0MCEgcy2aAFcc0a",
		images: ["/vite.svg"],
		values: [
			{ name: "loreal", value: "LOREAL" },
			{ name: "yambal", value: "YAMBAL" },
		],
	},
	{
		amount: 2,
		reference: "00000001-00000002",
		createdAt: "2024-09-29T22:20:51.313Z",
		updatedAt: "2024-09-29T22:20:51.313Z",
		id: "variants/8O2IV0MCEgcy2aAFcc0b",
		images: ["/vite.svg"],
		values: [
			{ name: "color", value: "ROJO" },
			{ name: "tamaño", value: "M" },
		],
	},
];

const meta: GenericMeta<typeof TableSimple> = {
	title: "Table",
	component: TableSimple,
	args: { nodes, modalProps: { class: "--txtColor", invertTheme: true } },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { TableSimple },
		setup() {
			async function deleteNode(node: Record<string, any>) {
				return !!node;
			}

			return { args, deleteNode };
		},
		template: `
			<TableSimple v-bind="args" :delete-node="deleteNode"/>
		`,
	}),
	args: { nodes },
};

export const Empty: Story = {
	args: { nodes: [] },
};

export const Opaque: Story = {
	render: (args) => ({
		components: { TableSimple },
		setup() {
			return { args };
		},
		template: `
		<div class="--width-100 --bgColor-secondary --p-30">
			<TableSimple v-bind="args"/>
		</div>
		`,
	}),
	args: { nodes, opaque: true },
};

export const Nested: Story = {
	render: (args) => ({
		components: { TableSimple },
		setup() {
			return { args, subNodes };
		},
		template: `
		<TableSimple v-bind="args" >
			<TableSimple :modal-props="args.modalProps" :nodes="subNodes" nested />
		</TableSimple>
		`,
	}),
	args: { nodes, childrenCountKey: "variants" },
};

export const NestedOpaque: Story = {
	render: (args) => ({
		components: { TableSimple },
		setup() {
			return { args, subNodes };
		},
		template: `
		<div class="--width-100 --bgColor-secondary --p-30">
			<TableSimple v-bind="args" >
				<TableSimple :modal-props="args.modalProps" :nodes="subNodes" nested />
			</TableSimple>
		</div>
		`,
	}),
	args: { nodes, childrenCountKey: "variants", opaque: true },
};

export default meta;
