import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ValueList from "./List.vue";

const value = {
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
};

const meta: Meta<typeof ValueList> = {
	title: "Value/Value List",
	component: ValueList,
	args: { value },
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	args: { value },
};

export default meta;
