import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";

import type { iForm, iInvalidInput, tFormInput } from "@open-xamu-co/ui-common-types";
import { useForm } from "@open-xamu-co/ui-common-helpers";

import ModalSimple from "./Simple.vue";
import ActionButton from "../action/Button.vue";
import BoxAction from "../box/Action.vue";
import FormStages from "../form/Stages.vue";
import ActionButtonToggle from "../action/ButtonToggle.vue";
import IconFa from "../icon/Fa.vue";

import { stagesData } from "../form/Stages.stories";

const meta: Meta<typeof ModalSimple> = {
	title: "Modal",
	component: ModalSimple,
	args: {
		title: "Modal sample",
		subtitle: "Customize your modal",
		class: "--txtColor",
		invertTheme: true,
		saveButton: { title: "Trigger save event" },
	},
};

type Story = StoryObj<typeof meta>;

export const Sample: Story = {
	render: (args) => ({
		components: { ModalSimple, ActionButton },
		setup() {
			function handleSave(closeModal?: (s?: any) => void) {
				closeModal?.(alert("We will close this modal"));
			}

			return { args, handleSave };
		},
		template: `
<ModalSimple v-bind="args" @save="handleSave">
	<template #toggle="{ toggleModal, model, modalRef, invertedTheme }">
		<ActionButton @click="toggleModal">Open Modal</ActionButton>
	</template>
	<template #default>
		Hi, i'm the modal content
	</template>
</ModalSimple>
		`,
	}),
};

export const WithFormStages: Story = {
	render: (args) => ({
		components: { ModalSimple, BoxAction, ActionButtonToggle, IconFa, FormStages },
		setup() {
			const updated = ref(false);
			const stages = computed<iForm[][]>(() => {
				return stagesData;
			});

			function updateUiComponentId({ uiComponent }: Record<string, any[]>) {
				if (uiComponent) updated.value = true;
			}

			async function submitFn(inputs: tFormInput[]): Promise<boolean | iInvalidInput[]> {
				const { utils } = useForm();

				const { values, invalidInputs } = utils.getFormValues(inputs);

				alert(JSON.stringify(values));

				if (invalidInputs.length) return invalidInputs;

				return true;
			}

			return { args, updated, stages, submitFn, updateUiComponentId };
		},
		template: `
<ModalSimple v-bind="args">
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
</ModalSimple>
		`,
	}),
	args: {
		title: "Create offer field",
		subtitle: "Complete the following data",
	},
};

export default meta;
