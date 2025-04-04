<template>
	<BaseErrorBoundary :theme="theme">
		<LoaderContent
			:loading="submitting || loading"
			:content="!!stages?.length"
			:theme="theme"
			class="flx --flxColumn --flx-start-stretch --gap-30 --maxWidth-full"
			:unwrap="unwrap"
		>
			<div
				v-if="(formInputsKeys?.length || $slots.default) && !loading"
				class="modal-content"
				:class="unwrap ? 'scroll --vertical' : ''"
			>
				<form
					method="post"
					class="flx --flxColumn --flx-start-stretch"
					:class="stagesClasses ?? '--gap-30'"
				>
					<slot></slot>
					<template v-if="formInputsKeys?.length">
						<div
							class="flx --flxColumn --flx-start-stretch"
							:class="[stagesClasses ?? '--gap-30', $attrs.class]"
						>
							<FormSimple
								v-for="key in formInputsKeys[activeStage]"
								:key="[key, activeStage].join('-')"
								:model-value="formInputs[key].inputs"
								:theme="theme"
								:invalid="invalid"
								no-form
								:title="formInputs[key].title"
								:readonly="formInputs[key].readonly"
								:empty-message="formInputs[key].emptyMessage"
								@update:model-value="updateForm(key, $event)"
								@update:invalid="invalid = $event"
							/>
						</div>
						<slot
							v-if="!hideRequiredDisclaimer || $slots.disclaimers"
							name="disclaimers"
						>
							<p class="--txtSize-xs">
								{{ t("required_verification") }}
							</p>
						</slot>
					</template>
				</form>
			</div>
			<slot name="actions">
				<div class="flx --flxRow-wrap --flx-start-center --width-100 modal-content">
					<slot
						v-if="stages?.length"
						name="primary-actions"
						v-bind="{
							activeStage,
							stagesLength: stages && stages.length,
							setActiveStage,
							canSubmit,
							submit,
						}"
					>
						<div class="flx --flxRow --flx-start-center --flx --gap-5 --gap:md">
							<ActionButtonToggle
								v-if="formInputsKeys.length > 1 && activeStage"
								key="button-back"
								:theme="theme"
								:aria-label="t('previous')"
								round=":sm-inv"
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
									submitFn &&
									(activeStage === formInputsKeys.length - 1 ||
										!formInputsKeys.length)
								"
								key="button-submit"
								:theme="theme"
								:aria-label="t('send')"
								:disabled="!canSubmit"
								@click.prevent="submit"
							>
								{{ submitLabel || t("send") }}
							</ActionButton>
							<ActionButtonToggle
								v-if="
									formInputsKeys.length > 1 &&
									activeStage < formInputsKeys.length - 1
								"
								key="button-next"
								:theme="theme"
								:aria-label="t('next')"
								round=":sm-inv"
								@click.prevent="setActiveStage(activeStage + 1)"
							>
								<span class="--hidden-full:sm-inv">{{ t("next") }}</span>
								<IconFa name="arrow-right" />
								<IconFa name="arrow-right" regular />
							</ActionButtonToggle>
						</div>
					</slot>
					<slot
						name="secondary-actions-content"
						v-bind="{
							activeStage,
							stagesLength: stages && stages.length,
							setActiveStage,
							canSubmit,
							submit,
						}"
					>
						<div
							class="flx --flxRow-wrap --flx-end-center --gap-5 --gap-10:sm --gap:md"
						>
							<slot name="secondary-actions"></slot>
							<ActionLink
								:aria-label="t('clear')"
								:theme="theme"
								:disabled="!canSubmit"
								@click="resetStages"
							>
								<IconFa name="broom" :size="20" />
							</ActionLink>
						</div>
					</slot>
				</div>
			</slot>
		</LoaderContent>
	</BaseErrorBoundary>
</template>

<script setup lang="ts">
	import { onBeforeUnmount, ref, watch } from "vue";
	import debounce from "lodash-es/debounce";
	import isEqual from "lodash-es/isEqual";

	import type { iForm, iInvalidInput, tFormInput, tProps } from "@open-xamu-co/ui-common-types";
	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import IconFa from "../icon/Fa.vue";
	import ActionLink from "../action/Link.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import LoaderContent from "../loader/Content.vue";
	import FormSimple from "./Simple.vue";

	import type { iUseThemeProps } from "../../types/props";
	import { useHelpers } from "../../composables/utils";

	export interface iFormStages extends iUseThemeProps {
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
		submitFn?: (values: tFormInput[], event?: Event) => Promise<boolean | iInvalidInput[]>;
		/** Perform additional actions if submit succeds */
		successFn?: () => void;
		/**
		 * Omit requiring filling up the form
		 */
		optional?: boolean;
		/**
		 * Do not wrap
		 */
		unwrap?: boolean;
	}

	/**
	 * Form Stages
	 * TODO: enable transitions conditionally
	 *
	 * @see https://vuejs.org/guide/built-ins/keep-alive.html
	 * @see https://vuejs.org/api/built-in-directives.html#v-memo
	 *
	 * @component
	 */

	defineOptions({ name: "FormStages", inheritAttrs: true });

	const props = defineProps<iFormStages>();
	const emit = defineEmits(["input-values", "submited", "set-active-stage"]);

	const { t } = useHelpers(useI18n);

	const canSubmit = ref(props.optional);
	const activeStage = ref(0);
	const invalid = ref<iInvalidInput[]>([]);
	const formInputsKeys = ref<string[][]>([]);
	const formInputs = ref<Record<string, iForm>>({});
	const loading = ref(true);
	/**
	 * Wheter external changes are comming to stages
	 */
	const lastListened = ref<string>();
	/**
	 * Submit process is loading/running
	 */
	const submitting = ref<boolean>(false);

	const submit = debounce(async (e: Event) => {
		submitting.value = true;

		// get inputs
		const inputs = Object.values(formInputs.value)
			.map(({ inputs }) => inputs)
			.flat();

		if (!inputs?.length) return;

		const successOrInvalid = await props.submitFn?.(inputs, e);

		submitting.value = false;

		// close or update invalid
		if (Array.isArray(successOrInvalid)) invalid.value = successOrInvalid;
		else {
			emit("submited", successOrInvalid);

			if (successOrInvalid) {
				resetStages(); // reset form
				props.successFn?.();
			}
		}
	});

	function generateFormKey(stageIndex: number, formIndex: number) {
		return `form-${stageIndex}-${formIndex}`;
	}
	function getValues(inputs: tFormInput[]): Record<string, unknown[]> {
		return inputs.reduce((acc, input) => ({ ...acc, [input.name]: input.values }), {});
	}
	function setStages(newStages: iForm[][]) {
		loading.value = true;

		// reset
		const newLocalStages: string[][] = [];
		const newLocalForms: Record<string, iForm> = {};
		const wasListened = lastListened.value;

		newStages
			.filter((s) => s.length)
			.forEach((stage, stageIndex) => {
				const keys: string[] = [];

				stage.forEach((form, formIndex) => {
					const key = form.key || generateFormKey(stageIndex, formIndex);
					const activeForm = formInputs.value[key];
					// prevent circular reference
					const reForm = { ...form, inputs: form.inputs.map((input) => input.clone()) };
					// check if type, icon or options length differ
					const activeFormDiff = activeForm?.inputs.map(({ type, icon, options }) => ({
						type,
						icon,
						options: options.length,
					}));
					const reFormDiff = reForm.inputs.map(({ type, icon, options }) => ({
						type,
						icon,
						options: options.length,
					}));

					keys.push(key);

					if (wasListened && isEqual(activeFormDiff, reFormDiff)) {
						// Prefer local value
						newLocalForms[key] = activeForm || reForm;
					} else newLocalForms[key] = reForm; // initialize or full reset

					if (form.listen) emit("input-values", getValues(newLocalForms[key].inputs));
				});

				newLocalStages.push(keys);
			});

		formInputsKeys.value = newLocalStages;
		formInputs.value = newLocalForms;
		loading.value = false;
	}

	function resetStages() {
		const wasListened = lastListened.value;

		loading.value = true;
		lastListened.value = undefined;

		if (wasListened) emit("input-values", {}, true);

		setStages(props.stages);
		canSubmit.value = !!props.optional;
		activeStage.value = 0;
	}

	function updateForm(key: string, newInputs: tFormInput[]) {
		formInputs.value[key].inputs = newInputs;

		// allow submiting after changes are detected
		if (!props.optional) canSubmit.value = true;
		if (!newInputs.length || !formInputs.value[key].listen) return;

		lastListened.value = key;
		emit("input-values", getValues(newInputs));
	}
	function setActiveStage(newValue: number) {
		activeStage.value = newValue;
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	// lifecycle
	emit("set-active-stage", setActiveStage);

	watch(
		() => props.stages,
		(newStages) => setStages(newStages),
		{ immediate: true }
	);

	onBeforeUnmount(resetStages);
</script>
