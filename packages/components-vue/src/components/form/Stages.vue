<template>
	<LoaderContent
		:loading="submitting"
		:content="!!stages?.length"
		:theme="theme"
		tag="form"
		method="post"
		class="flx --flxColumn --flx-start-stretch --gap-30 --maxWidth-full"
	>
		<div
			v-for="(stage, stageIndex) in localStages.filter((stage) => stage.length)"
			v-show="activeStage == stageIndex"
			:key="`stage-${stageIndex}`"
			:class="stagesClasses ?? 'flx --flxColumn --flx-start-stretch --gap-30'"
		>
			<FormSimple
				v-for="(form, formIndex) in stage"
				:key="`form-${formIndex}`"
				v-model.lazy="localStages[stageIndex][formIndex].inputs"
				:theme="theme"
				:invalid="invalid"
				no-form
				:title="form.title"
				:readonly="form.readonly"
				@update:invalid="invalid = $event"
			/>
		</div>
		<div class="flx --flxColumn --gap-30">
			<div v-if="!hideRequiredDisclaimer" class="flx --flxColumn">
				<p class="--txtSize-xs">{{ t("required_verification") }}</p>
			</div>
			<div class="flx --flxRow --flx-end-center --width">
				<div
					v-if="stages?.length"
					class="flx --flxRow --flx-start-center --flx --gap-5 --gap:md"
				>
					<slot
						name="primary-actions"
						v-bind="{
							activeStage,
							stagesLength: stages && stages.length,
							setActiveStage,
							canSubmit,
						}"
					>
						<ActionButtonToggle
							v-if="localStages.length > 1 && activeStage"
							key="button-back"
							:theme="theme"
							:aria-label="t('previous')"
							round=":sm"
							@click.prevent="setActiveStage(activeStage - 1)"
						>
							<IconFa name="arrow-left" />
							<IconFa name="arrow-left" regular />
							<span class="--hidden-full:sm-inv">
								{{ t("previous") }}
							</span>
						</ActionButtonToggle>
						<ActionButton
							v-if="
								submitLabel &&
								(activeStage === localStages.length - 1 || !localStages.length)
							"
							key="button-submit"
							:theme="theme"
							:aria-label="t('send')"
							:disabled="!canSubmit || !submitFn"
							@click.prevent="submit"
						>
							{{ submitLabel || t("send") }}
						</ActionButton>
						<ActionButtonToggle
							v-if="localStages.length > 1 && activeStage < localStages.length - 1"
							key="button-next"
							:theme="theme"
							:aria-label="t('next')"
							round=":sm"
							@click.prevent="setActiveStage(activeStage + 1)"
						>
							<span class="--hidden-full:sm-inv">{{ t("next") }}</span>
							<IconFa name="arrow-right" />
							<IconFa name="arrow-right" regular />
						</ActionButtonToggle>
					</slot>
				</div>
				<slot
					name="secondary-actions"
					v-bind="{
						activeStage,
						stagesLength: stages && stages.length,
						setActiveStage,
						canSubmit,
					}"
				></slot>
			</div>
		</div>
	</LoaderContent>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import _ from "lodash";

	import type { iInvalidInput, tProps } from "@open-xamu-co/ui-common-types";
	import {
		type FormInput as FormInputClass,
		useI18n,
		useUtils,
	} from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import LoaderContent from "../loader/Content.vue";
	import FormSimple from "./Simple.vue";

	import type { iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";

	type tSubmitFn = (values: FormInputClass[]) => Promise<boolean | iInvalidInput[]>;

	interface iForm {
		title?: string;
		inputs: FormInputClass[];
		listen?: boolean;
		/** Make all inputs read only by disabling them */
		readonly?: boolean;
	}

	interface iFormStages extends iUseThemeProps {
		/**
		 * Label for the submit button
		 */
		submitLabel?: string;
		stages?: iForm[][];
		showConformity?: boolean;
		hideRequiredDisclaimer?: boolean;
		stagesClasses?: tProps<string>;
		/**
		 * submit fn
		 */
		submitFn?: tSubmitFn;
	}

	/**
	 * Form Stages
	 * TODO: enable transitions conditionally
	 *
	 * @component
	 */

	defineOptions({ name: "FormStages", inheritAttrs: true });

	const props = defineProps<iFormStages>();
	const emit = defineEmits(["inputValues", "submited", "update:activeStage"]);

	const { t } = useHelpers(useI18n);
	const { isBrowser } = useHelpers(useUtils);

	const canSubmit = ref(false);
	const activeStage = ref(0);
	const invalid = ref<iInvalidInput[]>([]);
	/**
	 * Use stages as reference but do not update
	 *
	 * TODO: validate functionality of refactor
	 */
	const localStages = computed<iForm[][]>({
		get() {
			return props.stages || [];
		},
		set(updatedStages) {
			if (!(updatedStages && updatedStages.length)) return;

			// allow submiting after changes are detected
			!canSubmit.value && (canSubmit.value = true);
			updatedStages.forEach((stage, stageIndex) => {
				stage.forEach(({ listen, inputs }) => {
					// emit values if listen is enabled
					if (listen && stageIndex === activeStage.value) {
						const values: Record<string, unknown[]> = inputs.reduce((acc, input) => {
							return { ...acc, [input.name]: input.values };
						}, {});

						emit("inputValues", values);
					}
				});
			});
		},
	});
	/**
	 * Submit process is loading/running
	 */
	const submitting = ref<boolean>(false);
	const submit = _.debounce(async () => {
		submitting.value = true;

		// emit values
		const values = (props.stages || []).map((stage) => {
			return stage.map(({ inputs }) => inputs);
		});
		const successOrInvalid = await props.submitFn?.(values.flat(2));

		submitting.value = false;

		// close or update invalid
		if (Array.isArray(successOrInvalid)) invalid.value = successOrInvalid;
		else emit("submited", successOrInvalid);
	});

	function setActiveStage(newValue: number) {
		activeStage.value = newValue;
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	// lifecycle
	if (isBrowser) {
		// allow parent to switch the stage
		emit("update:activeStage", setActiveStage);
	}
</script>
