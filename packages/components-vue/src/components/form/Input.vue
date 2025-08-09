<template>
	<BaseErrorBoundary :theme="theme">
		<div v-if="input.type !== eFT.HIDDEN" class="flx --flxColumn --flx-start --gap-5">
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
				class="--flx --width-100"
				:file-prefix="snakeCase(input.placeholder)"
				:model-value="modelValue"
				:invalid="isInvalidByValidation"
				v-bind="inputProps"
				@update:model-value="$emit('update:model-value', $event)"
			/>
			<!-- Future inner loop input -->
			<FormInputLoop
				v-else
				v-slot="{ i }"
				:key="input.options.length + models.length"
				:models="models"
				:input="input"
				:theme="theme"
				:readonly="readonly"
			>
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
								input.options.length,
								input.defaults?.[i]?.placeholder,
								input.defaults?.[i]?.type,
								i + index,
							].join('-')
						"
						:input="
							input
								.clone({
									...input.defaults[index], // sub input
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
						@update:model-value="updateArrModel(i, index, $event[0])"
					/>
				</div>
				<FormInputNValues
					v-else-if="input.type === eFT.NEW_PASSWORD"
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
						type="number"
						class="--width-180:md --flx"
					/>
				</FormInputNValues>
				<FormInputNValues
					v-else-if="input.type === eFT.PHONE || input.type === eFT.CELLPHONE"
					v-bind="{ loading, errors, refresh }"
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
					v-bind="{ loading, errors, refresh }"
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
					:model="models[i].value"
					:values="[]"
				>
					<!-- TODO: build schedule input component -->
					<p>Schedule Component Here</p>
				</FormInputNValues>
				<BaseBox
					v-else-if="input.type === eFT.BOOLEAN"
					el="label"
					class="--flx --width-100 --txtAlign"
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
				>
					<component
						:is="input.type === eFT.SELECT ? SelectSimple : SelectFilter"
						v-model="models[i].value"
						v-bind="inputProps"
						:invalid="isInvalidByValidation"
						:theme="theme"
						:disabled="readonly"
						:placeholder="input.placeholder"
						:options="options"
						class="--flx"
					/>
				</FormInputOptions>
				<InputColor
					v-else-if="input.type === eFT.COLOR"
					v-model="models[i].value"
					v-bind="inputProps"
					:theme="theme"
					:disabled="readonly"
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
					class="--flx"
				/>
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
	import { computed, reactive } from "vue";
	import isEqual from "lodash-es/isEqual";
	import snakeCase from "lodash-es/snakeCase";
	import omit from "lodash-es/omit";

	import type { iInvalidInput, iSelectOption, tFormInput } from "@open-xamu-co/ui-common-types";
	import { eFormType as eFT } from "@open-xamu-co/ui-common-enums";
	import { useI18n, useForm } from "@open-xamu-co/ui-common-helpers";

	import BaseBox from "../base/Box.vue";
	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import InputColor from "../input/Color.vue";
	import InputText from "../input/Text.vue";
	import InputToggle from "../input/Toggle.vue";
	import InputFile from "../input/File.vue";
	import SelectSimple from "../select/Simple.vue";
	import SelectFilter from "../select/Filter.vue";
	import SelectChoice from "../select/Choice.vue";

	// input helper components
	import FormInputOptions from "./InputOptions.vue";
	import FormInputNValues from "./InputNValues.vue";
	import FormInputLoop from "./InputLoop.vue";
	import FormInputCountriesAPI from "./InputCountriesAPI.vue";

	import type { iCity, iCountry, iState } from "../../types/countries";
	import type { iUseThemeProps } from "../../types/props";
	import useInput from "../../composables/input";
	import useCountries from "../../composables/countries";
	import { useHelpers } from "../../composables/utils";

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
	const emit = defineEmits(["update:model-value"]);

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

	function updateArrModel(modelIndex: number, valuePosition: number, newValue: any) {
		const model: any[] = models.value[modelIndex].value;

		models.value[modelIndex].value = model.toSpliced(valuePosition, 1, newValue);
	}

	function stateToOption(state: iState): iSelectOption {
		return { value: state.code, alias: state.name };
	}
	function cityToOption(city: iCity): iSelectOption {
		return { value: city.name };
	}
</script>
