<template>
	<Dropdown invert-theme>
		<template #toggle="{ setModel }">
			<BoxAction icon="align-left" label="Open dropdown" @click="setModel" />
		</template>
		<h1 class="--txtColor">This is a text within a dropdown</h1>
	</Dropdown>
</template>

<script setup lang="ts">
	import BoxAction from "../components/box/Action.vue";
	import Dropdown from "../components/dropdown/Simple.vue";

	/**
	 * Dropdown with toggle
	 *
	 * @screen
	 */
</script>
