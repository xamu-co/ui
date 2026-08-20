<template>
	<BaseErrorBoundary at="FormInput" :theme="theme">
		<div v-if="input.type !== eFT.HIDDEN" class="flx --flxColumn --flx-start --flx --gap-5">
			<FormInputOptions
				v-if="!input.defaults && input.type === eFT.CHOICE"
				v-slot="{ options }"
				:input="input"
			>
				<SelectChoice
					:theme="theme"
					:disabled="readonly"
					:model-value="modelValue"
					v-bind="{ ...inputProps, options }"
					@update:model-value="$emit('update:model-value', $event)"
				/>
			</FormInputOptions>
			<InputFile
				v-else-if="!input.defaults && input.type === eFT.FILE"
				:theme="theme"
				:disabled="readonly"
				class="--maxWidth-full --flx"
				:file-prefix="snakeCase(input.placeholder)"
				:max-size="input.meta?.maxFileSize"
				:capture="input.meta?.capture"
				:model-value="modelValue"
				:invalid="isInvalidByValidation"
				:accept="input.meta?.accept"
				v-bind="inputProps"
				@update:model-value="$emit('update:model-value', $event)"
			/>
			<!-- Future inner loop input -->
			<FormInputLoop
				v-else
				:key="getFormInputOptionsLength(input.options) + models.length"
				v-bind="{ models, input, theme, readonly }"
			>
				<template #default="{ i }">
					<!-- Flexible input type -->
					<div
						v-if="input.defaults && input.defaults.length >= 2"
						class="flx --flxRow-wrap --flx-start-stretch --flx --gap-5"
					>
						<!-- Recursion -->
						<Input
							v-for="(model, index) in models[i].value"
							:key="
								[
									getFormInputOptionsLength(input.options),
									input.defaults?.[i]?.placeholder,
									input.defaults?.[i]?.type,
									i + Number(index),
								].join('-')
							"
							:input="
								input
									.clone({
										...input.defaults[Number(index)], // sub input
										multiple: false,
										defaults: undefined,
										values: [models[i].value[index]],
									})
									.setRerender($forceUpdate)
							"
							:theme="theme"
							class="--width-180:md --flx"
							:invalid="invalid"
							:model-value="[model]"
							:disabled="readonly"
							@update:model-value="updateArrModel(i, Number(index), $event[0])"
						/>
					</div>
					<FormInputNValues
						v-else-if="input.type === eFT.NEW_PASSWORD"
						v-bind="{ theme }"
						:model="models[i].value"
						:values="[2]"
					>
						<InputText
							:model-value="models[i].value[0]"
							v-bind="inputProps"
							:invalid="isInvalidByValidation"
							:theme="theme"
							:disabled="readonly"
							:placeholder="getInputPlaceholder()"
							type="password"
							class="--width-180:md --flx"
							@update:model-value="updateArrModel(i, 0, $event)"
						/>
						<InputText
							:model-value="models[i].value[1]"
							v-bind="inputProps"
							:invalid="isInvalidByValidation"
							:theme="theme"
							:disabled="readonly"
							:placeholder="getInputPlaceholder(1)"
							type="password"
							class="--width-180:md --flx"
							@update:model-value="updateArrModel(i, 1, $event)"
						/>
					</FormInputNValues>
					<FormInputNValues
						v-else-if="input.type === eFT.ID"
						v-bind="{ theme }"
						:model="models[i].value"
						:values="[2]"
					>
						<SelectSimple
							v-model="models[i].value[0]"
							v-bind="{ options: input.options, theme }"
							:disabled="readonly"
							class="--width-180:md --flx"
						/>
						<InputText
							v-model="models[i].value[1]"
							v-bind="inputProps"
							:invalid="isInvalidByValidation"
							:theme="theme"
							:disabled="readonly"
							:placeholder="getInputPlaceholder()"
							class="--width-180:md --flx"
						/>
					</FormInputNValues>
					<FormInputNValues
						v-else-if="input.type === eFT.PHONE || input.type === eFT.CELLPHONE"
						v-bind="{ loading, errors, refresh, theme }"
						:key="indicativesArr.length"
						:content="!!indicativesArr.length"
						:model="models[i].value"
						:label="t('form_awaiting_countries')"
						:values="[2]"
					>
						<SelectSimple
							:model-value="models[i].value[0]"
							:theme="theme"
							:disabled="readonly"
							:options="indicativesArr"
							class="--width-180:md --flx"
							@update:model-value="updateArrModel(i, 0, $event)"
						/>
						<InputText
							:model-value="models[i].value[1]"
							v-bind="inputProps"
							:invalid="isInvalidByValidation"
							:theme="theme"
							:disabled="readonly"
							:placeholder="getInputPlaceholder()"
							type="tel"
							class="--width-180:md --flx"
							@update:model-value="updateArrModel(i, 1, $event)"
						/>
					</FormInputNValues>
					<FormInputNValues
						v-else-if="input.type === eFT.LOCATION"
						v-bind="{ loading, errors, refresh, theme }"
						:key="statesArr?.length"
						:content="!!countriesArr.length"
						:model="models[i].value"
						:label="t('form_awaiting_countries')"
						:values="[1, 3]"
					>
						<!-- Single value means country, 3 values means country, state & city -->
						<FormInputCountriesAPI
							v-slot="{ statesReq, citiesReq }"
							v-bind="{ theme, states, countries, loading, errors, refresh }"
							:key="`${defaultCountry}-${countriesArr.length}-${statesArr?.length}`"
							:model="models[i].value"
						>
							<SelectFilter
								v-if="!defaultCountry || models[i].value.length === 1"
								:model-value="models[i].value[0]"
								:options="countriesArr"
								name="country"
								:value="defaultCountry"
								icon="earth-americas"
								:theme="theme"
								:disabled="readonly"
								:placeholder="getInputPlaceholder()"
								class="--width-180:md --flx"
								@update:model-value="updateArrModel(i, 0, $event)"
							/>
							<div
								v-if="models[i].value.length === 3"
								class="flx --flxRow-wrap --flx-start-stretch --gap-5 --flx"
							>
								<SelectFilter
									:model-value="models[i].value[1]"
									:options="statesArr || statesReq?.content?.map?.(stateToOption)"
									name="state"
									icon="mountain-sun"
									:theme="theme"
									:disabled="readonly || !(models[i].value[0] || defaultCountry)"
									:placeholder="getInputPlaceholder(1)"
									class="--width-180:md --flx"
									@update:model-value="updateArrModel(i, 1, $event)"
								/>
								<SelectFilter
									:model-value="models[i].value[2]"
									:options="citiesReq?.content?.map?.(cityToOption)"
									name="city"
									icon="city"
									:theme="theme"
									:disabled="readonly || !models[i].value[1]"
									:placeholder="getInputPlaceholder(2)"
									class="--width-180:md --flx"
									@update:model-value="updateArrModel(i, 2, $event)"
								/>
							</div>
						</FormInputCountriesAPI>
					</FormInputNValues>
					<FormInputNValues
						v-else-if="input.type === eFT.SCHEDULE"
						v-bind="{ theme }"
						:model="models[i].value"
						:values="[]"
					>
						<!-- TODO: build schedule input component -->
						<p>Schedule Component Here</p>
					</FormInputNValues>
					<BaseBox
						v-else-if="input.type === eFT.BOOLEAN"
						el="label"
						class="--maxWidth-full --flx --txtAlign"
						:theme="theme"
						:active="models[i].value"
						button
					>
						<!-- TODO: use switch type (unsupported style) -->
						<InputToggle
							v-model="models[i].value"
							v-bind="inputProps"
							:placeholder="getInputPlaceholder()"
							type="checkbox"
							:theme="theme"
							:disabled="readonly"
							full-width
							show-placeholder
						>
							<p v-if="input.placeholder" class="--txtSize-sm --txtWeight --txtWrap">
								{{ tet(input.placeholder) }}
							</p>
						</InputToggle>
					</BaseBox>
					<FormInputOptions
						v-else-if="input.type === eFT.SELECT || input.type === eFT.SELECT_FILTER"
						v-slot="{ options }"
						:input="input"
						:selected-value="models[i].value"
						:selected-values="reducedModels"
					>
						<component
							:is="input.type === eFT.SELECT ? SelectSimple : SelectFilter"
							v-model="models[i].value"
							v-bind="inputProps"
							:name="`${inputProps.name}-${i}`"
							:invalid="isInvalidByValidation"
							:theme="theme"
							:disabled="readonly"
							:placeholder="input.placeholder"
							:options="options"
							class="--maxWidth-full --flx"
						/>
					</FormInputOptions>
					<InputColor
						v-else-if="input.type === eFT.COLOR"
						v-model="models[i].value"
						v-bind="inputProps"
						:theme="theme"
						:disabled="readonly"
					/>
					<BoxEditor
						v-else-if="input.type === eFT.CODE"
						v-model="models[i].value"
						v-bind="{ input, theme, readonly }"
						class="--maxWidth-full --flx"
					/>
					<InputTime
						v-else-if="
							input.type === eFT.DATE ||
							input.type === eFT.DATETIME ||
							input.type === eFT.TIME
						"
						v-model="models[i].value"
						v-bind="inputProps"
						:type="getInputTextType()"
						:invalid="isInvalidByValidation"
						:theme="theme"
						:disabled="readonly"
						:placeholder="getInputPlaceholder()"
						class="--maxWidth-full --flx"
					/>
					<!-- Future outer loop input -->
					<InputText
						v-else
						v-model="models[i].value"
						v-bind="{
							...inputProps,
							...(input.type === eFT.LONGTEXT
								? { textarea: true }
								: { type: getInputTextType() }),
						}"
						:invalid="isInvalidByValidation"
						:theme="theme"
						:disabled="readonly"
						:placeholder="getInputPlaceholder()"
						class="--maxWidth-full --flx"
					/>
				</template>
				<template v-if="$slots.inputActions" #inputActions>
					<slot name="inputActions" v-bind="{ input, models, theme, readonly }"></slot>
				</template>
			</FormInputLoop>
			<template v-if="isInvalidByProps">
				<p v-if="input.required && !notEmpty" class="--txtColor-danger --txtSize-sm">
					{{ t("form_required_field") }}
				</p>
				<p v-else class="--txtColor-danger --txtSize-sm">
					{{ t("form_invalid_field") }}
				</p>
			</template>
		</div>
	</BaseErrorBoundary>
</template>
<script setup lang="ts">
	import { computed, reactive, defineAsyncComponent } from "vue";
	import isEqual from "lodash-es/isEqual";
	import snakeCase from "lodash-es/snakeCase";
	import omit from "lodash-es/omit";

	import type { iInvalidInput, iSelectOption, tFormInput } from "@open-xamu-co/ui-common-types";
	import { eFormType as eFT } from "@open-xamu-co/ui-common-enums";
	import { useI18n, useForm, getFormInputOptionsLength } from "@open-xamu-co/ui-common-helpers";

	import BaseBox from "../base/Box.vue";
	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import InputText from "../input/Text.vue";
	import InputToggle from "../input/Toggle.vue";
	import SelectSimple from "../select/Simple.vue";
	import LoaderSimple from "../loader/Simple.vue";

	// input helper components
	import FormInputOptions from "./InputOptions.vue";
	import FormInputNValues from "./InputNValues.vue";
	import FormInputLoop from "./InputLoop.vue";

	import type { iCity, iCountry, iState } from "../../types/countries";
	import type { iUseThemeProps } from "../../types/props";
	import useInput from "../../composables/input";
	import useCountries from "../../composables/countries";
	import { useHelpers } from "../../composables/utils";

	const InputColor = defineAsyncComponent({
		loader: () => import("../input/Color.vue"),
		loadingComponent: LoaderSimple,
	});
	const InputFile = defineAsyncComponent({
		loader: () => import("../input/File.vue"),
		loadingComponent: LoaderSimple,
	});
	const InputTime = defineAsyncComponent({
		loader: () => import("../input/Time.vue"),
		loadingComponent: LoaderSimple,
	});
	const SelectFilter = defineAsyncComponent({
		loader: () => import("../select/Filter.vue"),
		loadingComponent: LoaderSimple,
	});
	const SelectChoice = defineAsyncComponent({
		loader: () => import("../select/Choice.vue"),
		loadingComponent: LoaderSimple,
	});
	const BoxEditor = defineAsyncComponent({
		loader: () => import("../box/Editor.vue"),
		loadingComponent: LoaderSimple,
	});
	const FormInputCountriesAPI = defineAsyncComponent({
		loader: () => import("./InputCountriesAPI.vue"),
		loadingComponent: LoaderSimple,
	});

	export interface iFormInputProps extends iUseThemeProps {
		modelValue: any[];
		input: tFormInput;
		invalid?: iInvalidInput;
		countries?: iCountry[];
		states?: iState[];
		loading?: boolean;
		errors?: unknown;
		refresh?: (...args: any[]) => any;
		/** Make all inputs read only by disabling them */
		readonly?: boolean;
	}

	/**
	 * Factory component for forms
	 *
	 * @component
	 */

	defineOptions({ name: "FormInput", inheritAttrs: false });

	const props = defineProps<iFormInputProps>();
	const emit = defineEmits<{ (e: "update:model-value", value: any[]): any }>();

	const { t, tet } = useHelpers(useI18n);
	const { isValidFormInputValue, notEmptyValue } = useHelpers(useForm).utils;
	const { getInputPlaceholder, getInputAutocomplete, getInputTextType } = useInput(props);
	const { defaultCountry } = useCountries();

	const countriesArr = computed(() => {
		return (props.countries || []).map(({ code, name }) => ({ value: code, alias: name }));
	});
	const indicativesArr = computed(() => {
		return (props.countries || []).map(({ name, code, indicative }) => ({
			value: code + indicative,
			alias: name,
		}));
	});
	const statesArr = computed<iSelectOption[] | undefined>(() => {
		return props.states?.map(({ code, name }) => ({ value: code, alias: name }));
	});
	const notEmpty = computed(() => {
		const values = props.input.values;

		return !!values.length && values.every((v) => notEmptyValue(v, props.input.defaults));
	});
	const isInvalidByProps = computed<boolean>(() => {
		/** Validation expects an array with at least one element */
		const values = props.input.values.length ? props.input.values : [""];

		return isEqual(props.invalid?.invalidValue, values);
	});
	const isInvalidByValidation = computed<boolean>(() => {
		return isInvalidByProps.value || !isValidFormInputValue(props.input, true);
	});
	const inputProps = computed(() => {
		const [icon, iconProps] = props.input?.icon || [];

		return {
			...omit(props.input, ["type"]),
			autocomplete: getInputAutocomplete(),
			icon,
			iconProps,
		};
	});
	/**
	 * Multi Model
	 * should be returning the minimum of values
	 */
	const models = computed(() => {
		return props.modelValue.map((value, valueIndex) =>
			computed({
				get: () => (Array.isArray(value) ? reactive(value) : value),
				set: (newValue) => {
					emit("update:model-value", props.modelValue.toSpliced(valueIndex, 1, newValue));
				},
			})
		);
	});
	const reducedModels = computed(() => {
		return models.value.reduce((acc: any[], { value }: any) => {
			if (value !== "") acc.push(value);

			return acc;
		}, []);
	});

	function updateArrModel(modelIndex: number, valuePosition: number, newValue: any) {
		models.value[modelIndex].value.splice(valuePosition, 1, newValue);
	}

	function stateToOption(state: iState): iSelectOption {
		return { value: state.code, alias: state.name };
	}
	function cityToOption(city: iCity): iSelectOption {
		return { value: city.name };
	}
</script>
