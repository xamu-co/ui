import type { Meta, StoryObj } from "@storybook/vue3";

import Simple from "./Simple.vue";

const nodes = [
	{
		id: 1,
		slug: "jhon-doe",
		firstName: "Jhon Harrison",
		lastName: "Doe Johnson",
		email: "jhsj@xamu.com.co",
		cellphoneNumber: "1234567890",
		cellphoneIndicative: "CO+57",
		locationCountry: "CO",
		locationState: "VAC",
		locationCity: "Cali",
		address: "No address",
		zipCode: "124876",
		pathPhoto: "https://picsum.photos/seed/45465/100/100",
		createdAt: "2024-05-12T03:34:22.408Z",
		updatedAt: "2024-05-12T03:34:22.408Z",
		emailVerifiedAt: "2024-05-11T22:34:22.345Z",
		permissions: [
			{ endpoint: "GET_OWN_USER", description: "User can get who he is" },
			{ endpoint: "GET_USER", description: "User can get itself or another user" },
			{ endpoint: "REMOVE_BUSINESS", description: "User can remove their business" },
			{ endpoint: "REMOVE_OFFER", description: "User can remove a offer" },
			{ endpoint: "UPDATE_BUSINESS", description: "User can update their business" },
			{ endpoint: "CREATE_LOCAL", description: "User can create a local" },
			{ endpoint: "UPDATE_LOCAL", description: "User can update a local" },
			{ endpoint: "REMOVE_LOCAL", description: "User can remove a local" },
			{ endpoint: "CREATE_OFFER", description: "User can create a offer" },
			{ endpoint: "UPDATE_OFFER", description: "User can update a offer" },
			{ endpoint: "CREATE_OFFER_IMAGES", description: "User can add images to offer" },
			{ endpoint: "REMOVE_OFFER_IMAGE", description: "User can remove a offer image" },
			{ endpoint: "UPDATE_OWN_USER", description: "User can update a user" },
			{ endpoint: "GET_USERS", description: "User can get users" },
			{ endpoint: "REMOVE_USER", description: "User can remove a user" },
			{ endpoint: "CREATE_BUSINESS", description: "User can create their business" },
			{ endpoint: "CREATE_CATEGORY", description: "User can create a category" },
			{ endpoint: "UPDATE_CATEGORY", description: "User can update a category" },
			{ endpoint: "INTERNALS", description: "" },
			{ endpoint: "CREATE_SECTOR", description: "User can create a sector" },
			{ endpoint: "UPDATE_SECTOR", description: "User can update a sector" },
			{ endpoint: "UPDATE_CATEGORY_IMAGE", description: "User can update a category image" },
			{ endpoint: "CREATE_OFFER_FIELD", description: "User can create a offer field" },
			{ endpoint: "CREATE_PAYMENT_METHOD", description: "User can create a payment method" },
			{ endpoint: "UPDATE_PAYMENT_METHOD", description: "User can update a payment method" },
			{ endpoint: "UPDATE_PERMISSION", description: "User can update a permission" },
			{ endpoint: "UPDATE_OFFER_FIELD", description: "User can update a offer field" },
			{ endpoint: "REMOVE_CATEGORY", description: "User can remove a category" },
			{ endpoint: "REMOVE_SECTOR", description: "User can remove a sector" },
			{ endpoint: "REMOVE_PAYMENT_METHOD", description: "User can remove a payment method" },
			{ endpoint: "REMOVE_OFFER_FIELD", description: "User can remove a offer field" },
		],
		businesses: [],
	},
];

const meta = {
	title: "Table",
	component: Simple as Record<keyof typeof Simple, unknown>,
	args: { nodes },
} satisfies Meta<typeof Simple>;

type Story = StoryObj<typeof Simple>;

export const Sample: Story = {
	args: { nodes },
};

export const NoContent: Story = {
	args: { nodes: [] },
};

export default meta;
