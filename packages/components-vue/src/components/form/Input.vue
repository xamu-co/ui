<template>
	<div class="flx --flxColumn --flx-start --gap-5">
		<FormInputOptions
			v-if="!input.defaults && input.type === eFT.CHOICE"
			v-slot="{ options }"
			:input="input"
		>
			<div
				v-if="!!input.options?.length"
				class="flx --flxRow-wrap --flx-center --flx-start-center:md --maxWidth-440"
			>
				<component
					:is="input.multiple ? ActionButtonToggle : ActionButton"
					v-for="(option, optionIndex) in options"
					:key="optionIndex"
					size="md"
					:theme="theme"
					:aria-label="option.alias || option.value"
					:active="modelValue.includes(option.value)"
					:disabled="!input.multiple && modelValue.includes(option.value)"
					@click="choose(option.value)"
				>
					<span>{{ option.alias || option.value }}</span>
					<template v-if="option.icon">
						<IconFa :name="option.icon" />
						<IconFa v-if="input.multiple" :name="option.icon" regular />
					</template>
					<figure
						v-else-if="option.pattern"
						class="avatar --size-xs --bdr --bdrColor-light"
						:style="
							validator.isURL(option.pattern)
								? { backgroundImage: `url('${option.pattern}')` }
								: { backgroundColor: option.pattern }
						"
					></figure>
				</component>
			</div>
		</FormInputOptions>
		<InputFile
			v-else-if="!input.defaults && input.type === eFT.FILE"
			:theme="theme"
			class="--flx"
			:min="input.min"
			:max="input.max"
			:file-prefix="_.snakeCase(input.placeholder)"
			:model-value="modelValue"
			@update:model-value="$emit('update:model-value', $event)"
		/>
		<!-- Future inner loop input -->
		<FormInputLoop v-else v-slot="{ i }" :models="models" :input="input" :theme="theme">
			<div
				v-if="input.defaults && input.defaults.length >= 2"
				class="flx --flxColumn --flxRow-wrap:md --flx-start-stretch --flx"
			>
				<!-- Recursion -->
				<Input
					v-for="(model, index) in models[i].value"
					:key="
						input.defaults?.[index].placeholder || input.defaults?.[index].type || index
					"
					:input="
						input.setRerender($forceUpdate).clone({
							...input.defaults[index], // sub input
							multiple: false,
							defaults: undefined,
							values: [models[i].value[index]],
						})
					"
					:theme="theme"
					class="--width-180 --flx"
					:invalid="invalid"
					:model-value="[model]"
					@update:model-value="
						models[i].value = models[i].value.toSpliced(index, 1, $event[0])
					"
				/>
			</div>
			<FormInputNValues
				v-else-if="input.type === eFT.NEW_PASSWORD"
				:model="models[i].value"
				:values="[2]"
			>
				<InputText
					v-model="models[i].value[0]"
					v-bind="inputProps"
					:theme="theme"
					:placeholder="getInputPlaceholder()"
					type="password"
					class="--width-180 --flx"
				/>
				<InputText
					v-model="models[i].value[1]"
					v-bind="inputProps"
					:theme="theme"
					:placeholder="getInputPlaceholder()"
					type="password"
					class="--width-180 --flx"
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
					class="--width-180 --flx"
				/>
				<InputText
					v-model="models[i].value[1]"
					v-bind="inputProps"
					:theme="theme"
					:placeholder="getInputPlaceholder()"
					type="number"
					class="--width-180 --flx"
				/>
			</FormInputNValues>
			<FormInputNValues
				v-else-if="input.type === eFT.PHONE || input.type === eFT.CELLPHONE"
				:model="models[i].value"
				:values="[2]"
			>
				<SelectSimple
					v-model="models[i].value[0]"
					:theme="theme"
					:options="indicativesArr"
					class="--width-180 --flx"
				/>
				<InputText
					v-model="models[i].value[1]"
					v-bind="inputProps"
					:theme="theme"
					:placeholder="getInputPlaceholder()"
					type="tel"
					class="--width-180 --flx"
				/>
			</FormInputNValues>
			<FormInputCountriesAPI
				v-else-if="input.type === eFT.LOCATION"
				v-slot="{ statesReq, citiesReq }"
				:states="statesArr"
				:model="models[i].value"
				:values="[1, 3]"
			>
				<SelectFilter
					v-if="!defaultCountry || models[i].value.length === 1"
					v-model="models[i].value[0]"
					:options="countriesArr"
					:value="defaultCountry"
					icon="earth-americas"
					:theme="theme"
					:placeholder="getInputPlaceholder()"
					class="--width-180 --flx"
				/>
				<div
					v-if="models[i].value.length === 3"
					class="flx --flxColumn --flxRow-wrap:md --flx-start-stretch --gap-5 --flx"
				>
					<SelectFilter
						v-model="models[i].value[1]"
						:options="
							statesArr ||
							(statesReq.loading || statesReq.content.length
								? statesReq.content.map(stateToOption)
								: [models[i].value[0] || defaultCountry])
						"
						icon="mountain-sun"
						:theme="theme"
						:disabled="!(models[i].value[0] || defaultCountry)"
						:placeholder="getInputPlaceholder(1)"
						class="--width-180 --flx"
					/>
					<SelectFilter
						v-model="models[i].value[2]"
						:options="
							citiesReq.loading || citiesReq.content.length
								? citiesReq.content.map(cityToOption)
								: [models[i].value[1]]
						"
						icon="city"
						:theme="theme"
						:disabled="!models[i].value[1]"
						:placeholder="getInputPlaceholder(2)"
						class="--width-180 --flx"
					/>
				</div>
			</FormInputCountriesAPI>
			<FormInputNValues
				v-else-if="input.type === eFT.SCHEDULE"
				:model="models[i].value"
				:values="[]"
			>
				<!-- TODO: build schedule input component -->
				<p>Schedule Component Here</p>
			</FormInputNValues>
			<label v-else-if="input.type === eFT.BOOLEAN" class="--flx">
				<BoxMessage :theme="theme" class="--txtAlign">
					<!-- TODO: use switch type (unsupported style) -->
					<InputToggle
						v-model="models[i].value"
						v-bind="inputProps"
						:placeholder="getInputPlaceholder()"
						type="checkbox"
						:theme="theme"
						full-width
						show-placeholder
					>
						<p v-if="input.placeholder" class="--txtSize-sm --txtWeight --txtWrap">
							{{ tet(input.placeholder) }}
						</p>
					</InputToggle>
				</BoxMessage>
			</label>
			<FormInputOptions
				v-else-if="input.type === eFT.SELECT"
				v-slot="{ options }"
				:input="input"
			>
				<SelectSimple
					v-model="models[i].value"
					v-bind="inputProps"
					:theme="theme"
					:placeholder="input.placeholder"
					:options="options"
					class="--flx"
				/>
			</FormInputOptions>
			<FormInputOptions
				v-else-if="input.type === eFT.SELECT_FILTER"
				v-slot="{ options }"
				:input="input"
			>
				<SelectFilter
					v-model="models[i].value"
					v-bind="inputProps"
					:theme="theme"
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
				:theme="theme"
				:placeholder="getInputPlaceholder()"
				class="--flx"
			/>
		</FormInputLoop>
		<p
			v-if="input.required && !notEmpty && isInvalidInput"
			class="--txtColor-danger --txtSize-sm"
		>
			{{ t("form_required_field") }}
		</p>
	</div>
</template>
<script setup lang="ts">
	import { computed } from "vue";
	import validator from "validator";
	import _ from "lodash";

	import type { iInvalidInput, iSelectOption } from "@open-xamu-co/ui-common-types";
	import { eFormType as eFT } from "@open-xamu-co/ui-common-enums";
	import {
		type FormInput as FormInputClass,
		useI18n,
		useForm,
	} from "@open-xamu-co/ui-common-helpers";

	import IconFa from "../icon/Fa.vue";
	import ActionButton from "../action/Button.vue";
	import ActionButtonToggle from "../action/ButtonToggle.vue";
	import InputColor from "../input/Color.vue";
	import InputText from "../input/Text.vue";
	import InputToggle from "../input/Toggle.vue";
	import InputFile from "../input/File.vue";
	import SelectSimple from "../select/Simple.vue";
	import SelectFilter from "../select/Filter.vue";
	import BoxMessage from "../box/Message.vue";

	// input helper components
	import FormInputOptions from "./InputOptions.vue";
	import FormInputNValues from "./InputNValues.vue";
	import FormInputLoop from "./InputLoop.vue";
	import FormInputCountriesAPI from "./InputCountriesAPI.vue";

	import type { iCity, iCountry, iState } from "../../types/countries";
	import type { iUseThemeProps } from "../../types/props";
	import useInput from "../../composables/input";
	import useCountries from "../../composables/countries";
	import useHelpers from "../../composables/helpers";

	interface iFormInputProps extends iUseThemeProps {
		modelValue: any[];
		input: FormInputClass;
		invalid?: iInvalidInput;
		countries?: iCountry[];
		states?: iState[];
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

		return values.every((v) => notEmptyValue(v, props.input.defaults));
	});
	const isInvalidInput = computed<boolean>(() => {
		const values = props.input.values;
		const byProp = !!props.invalid && _.isEqual(props.invalid.invalidValue, values);
		const byValidation = notEmpty.value && !isValidFormInputValue(props.input);

		return byProp || byValidation;
	});
	const inputProps = computed(() => {
		const [icon, iconProps] = props.input?.icon || [];

		return {
			..._.omit(props.input, ["type"]),
			invalid: isInvalidInput.value,
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
				get: () => value,
				set: (newValue) => {
					emit("update:model-value", props.modelValue.toSpliced(valueIndex, 1, newValue));
				},
			})
		);
	});

	function choose(value: string | number) {
		if (props.input.multiple) {
			if (props.modelValue.includes(value)) {
				const index = props.modelValue.indexOf(value);

				if (index > -1) props.input.removeValue(index);
			} else {
				props.input.addValue(value);
			}
		} else {
			// old behavior, single value
			models.value[0].value = value;
		}
	}

	function stateToOption(state: iState): iSelectOption {
		return { value: state.code, alias: state.name };
	}
	function cityToOption(city: iCity): iSelectOption {
		return { value: city.name };
	}
</script>
