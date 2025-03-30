<template>
	<Modal
		v-bind="{
			title: 'Create offer field',
			subtitle: 'Complete the following data',
		}"
		class="--txtColor"
		invert-theme
		:save-button="{ title: 'Trigger save event' }"
		@save="handleSave"
	>
		>
		<template #toggle="{ toggleModal }">
			<BoxAction icon="align-left" label="Open modal" @click="toggleModal" />
		</template>
		<h1>This is a text within a modal</h1>
	</Modal>
</template>

<script setup lang="ts">
	import BoxAction from "../components/box/Action.vue";
	import Modal from "../components/modal/Simple.vue";

	/**
	 * Modal with toggle
	 *
	 * @screen
	 */

	function handleSave(closeModal?: (s?: any) => void) {
		closeModal?.(alert("We will close this modal"));
	}
</script>
