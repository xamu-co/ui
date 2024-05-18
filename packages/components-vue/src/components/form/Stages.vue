<template>
	<BaseErrorBoundary :theme="theme">
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
					:key="`form-${stageIndex}-${formIndex}`"
					:model-value="localStages[stageIndex][formIndex].inputs"
					:theme="theme"
					:invalid="invalid"
					no-form
					:title="form.title"
					:readonly="form.readonly"
					@update:model-value="updateForm(stageIndex, formIndex, $event)"
					@update:invalid="invalid = $event"
				/>
			</div>
			<div class="flx --flxColumn --gap-30">
				<div class="flx --flxColumn">
					<slot name="disclaimers">
						<p v-if="!hideRequiredDisclaimer" class="--txtSize-xs">
							{{ t("required_verification") }}
						</p>
					</slot>
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
								v-if="
									localStages.length > 1 && activeStage < localStages.length - 1
								"
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
	</BaseErrorBoundary>
</template>

<script setup lang="ts">
	import { markRaw, ref } from "vue";
	import _ from "lodash";

	import type { iInvalidInput, tProps } from "@open-xamu-co/ui-common-types";
	import {
		type iForm,
		type FormInput as FormInputClass,
		useI18n,
		useUtils,
		FormInput,
	} from "@open-xamu-co/ui-common-helpers";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import IconFa from "../icon/Fa.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import LoaderContent from "../loader/Content.vue";
	import FormSimple from "./Simple.vue";

	import type { iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";

	type tSubmitFn = (values: FormInputClass[]) => Promise<boolean | iInvalidInput[]>;

	interface iFormStages extends iUseThemeProps {
		/**
		 * Label for the submit button
		 */
		submitLabel?: string;
		stages: iForm[][];
		hideRequiredDisclaimer?: boolean;
		stagesClasses?: tProps<string>;
		/**
		 * submit fn
		 */
		submitFn?: tSubmitFn;
		/**
		 * Omit requiring filling up the form
		 */
		optional?: boolean;
	}

	/**
	 * Form Stages
	 * TODO: enable transitions conditionally
	 *
	 * @component
	 */

	defineOptions({ name: "FormStages", inheritAttrs: true });

	const props = defineProps<iFormStages>();
	const emit = defineEmits(["input-values", "submited", "set-active-stage"]);

	const { t } = useHelpers(useI18n);
	const { isBrowser } = useHelpers(useUtils);

	const canSubmit = ref(props.optional);
	const activeStage = ref(0);
	const invalid = ref<iInvalidInput[]>([]);
	const localStages = ref(markRaw(props.stages));
	/**
	 * Submit process is loading/running
	 */
	const submitting = ref<boolean>(false);

	const submit = _.debounce(async () => {
		submitting.value = true;

		// get inputs
		const inputs = (props.stages || [])
			.map((stage) => {
				return stage.map(({ inputs }) => inputs);
			})
			.flat(2);
		const successOrInvalid = await props.submitFn?.(inputs);

		submitting.value = false;

		// close or update invalid
		if (Array.isArray(successOrInvalid)) invalid.value = successOrInvalid;
		else {
			emit("submited", successOrInvalid);
			localStages.value = props.stages; // reset form
		}
	});

	function updateForm(stageIndex: number, formIndex: number, formInputs: FormInput[]) {
		localStages.value[stageIndex][formIndex].inputs = formInputs;

		// allow submiting after changes are detected
		if (!props.optional) canSubmit.value = true;
		if (!formInputs.length || localStages.value[stageIndex][formIndex].listen!) return;

		const values: Record<string, unknown[]> = formInputs.reduce((acc, input) => {
			return { ...acc, [input.name]: input.values };
		}, {});

		emit("input-values", values);
	}
	function setActiveStage(newValue: number) {
		activeStage.value = newValue;
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	// lifecycle
	if (isBrowser) {
		// allow parent to switch the stage
		emit("set-active-stage", setActiveStage);
	}
</script>
