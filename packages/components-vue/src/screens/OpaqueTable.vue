<template>
	<div class="flx --flxColumn --flx-start-stretch --gap-5 --p-30 --width-100 --bgColor-primary">
		<Table
			:nodes="Array(2).fill(content)"
			:modal-props="{ class: '--txtColor' }"
			:create-node-children="({ id }) => !!id"
			:delete-node="deleteNode"
			children-name="Variantes"
			children-count-key="variants"
			opaque
		>
			<Table
				:nodes="Array(2).fill(subContent)"
				:modal-props="{ class: '--txtColor' }"
				:delete-node="deleteNode"
				opaque
				nested
			/>
		</Table>
	</div>
</template>

<script setup lang="ts">
	import Table from "../components/table/Simple.vue";

	export interface iSector {
		id: number;
		categories: Record<string, any>[];
		name: string;
		description: string;
	}

	/**
	 * Table with nested table
	 *
	 * @screen
	 */

	const content = {
		name: "Labial rojo generico",
		description: "Este es un labial generico",
		price: 2443535,
		iva: false,
		reference: "00000001",
		createdAt: "2024-09-29T22:17:30.725Z",
		variants: 1,
		visible: true,
		updatedAt: "2024-09-29T22:22:00.879Z",
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
		id: "products/AirZ2PNDHNYXQYatt3Pi",
	};
	const subContent = {
		amount: 6,
		values: { "marca labial": "YAMBAL" },
		reference: "00000001-00000001",
		createdAt: "2024-09-29T22:20:51.313Z",
		updatedAt: "2024-09-29T22:20:51.313Z",
		id: "variants/8O2IV0MCEgcy2aAFcc0a",
		images: ["/vite.svg"],
	};

	async function deleteNode(node: Record<string, any>) {
		return !!node;
	}
</script>
