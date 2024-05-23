<template>
	<Modal
		v-bind="{
			title: 'Create offer field',
			subtitle: 'Complete the following data',
		}"
		class="--txtColor"
		hide-footer
		invert-theme
	>
		<template #toggle="{ toggleModal }">
			<BoxAction icon="align-left" label="Offer field" @click="toggleModal" />
		</template>
		<template #default="{ toggleModal }">
			<FormStages
				v-bind="{
					stages,
					submitFn,
					submitLabel: 'Create offer field',
				}"
				class="--pTop --pBottom --width-440:md"
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
	import type { iInvalidInput } from "@open-xamu-co/ui-common-types";
	import { FormInput, useForm, type iForm } from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../components/icon/Fa.vue";
	import ActionButtonToggle from "../components/action/ButtonToggle.vue";
	import BoxAction from "../components/box/Action.vue";
	import FormStages from "../components/form/Stages.vue";
	import Modal from "../components/modal/Simple.vue";

	import { stages as formStages } from "../components/form/Stages.stories";

	/**
	 * Modal with form stages
	 */

	const stages = computed<iForm[][]>(() => {
		return formStages;
	});

	function updateUiComponentId({ uiComponent }: Record<string, any[]>) {
		if (uiComponent) console.log(uiComponent);
	}

	async function submitFn(inputs: FormInput[]): Promise<boolean | iInvalidInput[]> {
		const { utils } = useForm();

		console.log(utils.getFormValues(inputs));

		return true;
	}
</script>
