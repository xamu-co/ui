<template>
	<Modal
		v-bind="{
			title: 'Create offer field',
			subtitle: 'Complete the following data',
		}"
		class="--txtColor"
		invert-theme
	>
		<template #toggle="{ toggleModal }">
			<BoxAction icon="align-left" label="Offer field" @click="toggleModal" />
		</template>
		<template #content="{ toggleModal }">
			<FormStages
				v-bind="{
					stages,
					submitFn,
					submitLabel: 'Create offer field',
				}"
				unwrap
				class="--width-440:md"
				v-on="{
					submited: toggleModal,
					inputValues: updateUiComponentId,
				}"
			>
				<template #secondary-actions>
					<ActionButtonToggle
						aria-label="Cancel"
						round=":sm-inv"
						@click.prevent="toggleModal()"
					>
						<IconFa name="xmark" hidden="-full:sm" />
						<IconFa name="xmark" regular hidden="-full:sm" />
						<span class="--hidden-full:sm-inv">Cancel</span>
					</ActionButtonToggle>
				</template>
			</FormStages>
		</template>
	</Modal>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	import type { iForm, iInvalidInput, tFormInput } from "@open-xamu-co/ui-common-types";
	import { useForm } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../components/icon/Fa.vue";
	import ActionButtonToggle from "../components/action/ButtonToggle.vue";
	import BoxAction from "../components/box/Action.vue";
	import FormStages from "../components/form/Stages.vue";
	import Modal from "../components/modal/Simple.vue";

	import { stagesData } from "../components/form/Stages.stories";

	/**
	 * Modal with form stages
	 *
	 * @screen
	 */

	const stages = computed<iForm[][]>(() => {
		return stagesData;
	});

	function updateUiComponentId({ uiComponent }: Record<string, any[]>) {
		if (uiComponent) console.log(uiComponent);
	}

	async function submitFn(inputs: tFormInput[]): Promise<boolean | iInvalidInput[]> {
		const { utils } = useForm();

		const { values, invalidInputs } = utils.getFormValues(inputs);

		alert(JSON.stringify(values));

		if (invalidInputs.length) return invalidInputs;

		return true;
	}
</script>
