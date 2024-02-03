<template>
	<BaseErrorBoundary :theme="theme">
		<LoaderContentFetch
			v-if="modelValue?.length"
			v-slot="{ content }"
			:theme="theme"
			:label="t('form_loading_countries')"
			:promise="(withLocationInput || withPhoneInput) && getCountriesAndStates"
			class="flx --flxColumn --flx-start-stretch --gap-10 --maxWidth-full"
			:el="noForm ? 'fieldset' : 'form'"
			:fallback="{ countries: [], states: [] }"
		>
			<legend v-if="title">
				<h4>{{ title }}:</h4>
			</legend>
			<div
				v-for="(input, inputIndex) in model"
				:key="inputIndex"
				class="flx --flxColumn --flx-start-stretch --gap-5"
			>
				<p v-if="getSuggestedTitle(input)" class="--txtSize-sm">
					{{ getSuggestedTitle(input) }}
				</p>
				<FormInput
					:readonly="readonly"
					:theme="theme"
					:input="input"
					:invalid="getInvalid(input.name)"
					:countries="content.countries"
					:states="withLocationInput && !!defaultCountry ? content.states : undefined"
					:model-value="model[inputIndex].values"
					@update:model-value="updateValues(inputIndex, $event)"
				/>
			</div>
		</LoaderContentFetch>
		<BoxMessage v-else :theme="theme">
			<div class="flx --flxRow --flx-center">
				<span>{{ emptyMessage || t("nothing_to_show") }}</span>
			</div>
		</BoxMessage>
	</BaseErrorBoundary>
</template>

<script setup lang="ts" generic="P extends any[] = any[]">
	import { computed, ref, watch } from "vue";
	import _ from "lodash";

	import type { iInvalidInput } from "@open-xamu-co/ui-common-types";
	import { eFormType, eFormTypeSimple } from "@open-xamu-co/ui-common-enums";
	import { type FormInput as FormInputClass, useI18n } from "@open-xamu-co/ui-common-helpers";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import BoxMessage from "../box/Message.vue";
	import FormInput from "./Input.vue";
	import LoaderContentFetch from "../loader/ContentFetch.vue";

	import type { iUseThemeProps } from "../../types/props";
	import type { iState } from "../../types/countries";
	import useCountries from "../../composables/countries";
	import { useHelpers } from "../../composables/utils";

	interface iFormSimple<P extends any[]> extends iUseThemeProps {
		title?: string;
		emptyMessage?: string;
		modelValue?: FormInputClass[];
		noForm?: boolean;
		invalid?: iInvalidInput[];
		payload?: P;
		/**
		 * Make model
		 */
		make?: (...args: P) => FormInputClass[];
		/** Make all inputs read only by disabling them */
		readonly?: boolean;
	}

	/**
	 * Factory component for forms
	 *
	 * @component
	 */

	defineOptions({ name: "FormSimple", inheritAttrs: true });

	const props = defineProps<iFormSimple<P>>();
	const emit = defineEmits(["update:invalid", "update:model-value"]);

	const { t, tet } = useHelpers(useI18n);
	const { defaultCountry, getCountries, getCountryStates } = useCountries();

	/**
	 * Was make used?
	 */
	const firstMake = ref(false);

	const withLocationInput = computed(() => {
		return props.modelValue?.some(({ type }) => type === eFormType.LOCATION);
	});
	const withPhoneInput = computed(() => {
		return props.modelValue?.some(({ type }) => {
			return type === eFormType.CELLPHONE || type === eFormType.PHONE;
		});
	});

	/**
	 * Fetch states if country is provided
	 *
	 * TODO: save to shared state to avoid over fetching
	 */
	async function getCountriesAndStates() {
		const countries = await getCountries();
		let states: iState[] = [];

		if (defaultCountry) states = await getCountryStates(defaultCountry);

		return { countries, states };
	}

	function updateValues(index: number, values: any[]) {
		model.value[index].values = values;

		// update values
		emit("update:model-value", props.modelValue?.toSpliced(index, 1, model.value[index]));

		if (!props.invalid?.length) return;

		// update invalid
		emit(
			"update:invalid",
			props.invalid.filter(({ invalidValue, name }) => {
				return model.value[index].name !== name || _.isEqual(invalidValue, values);
			})
		);
	}

	/**
	 * Form model
	 * maps inputs into computed values that could actually listen for changes then rolls back before emiting
	 */
	const model = computed<FormInputClass[]>(() =>
		(props.modelValue || []).filter(({ type, options, required }) => {
			// omit non required if options are not present
			if (
				eFormTypeSimple.SELECT === type ||
				eFormTypeSimple.SELECT_FILTER === type ||
				eFormTypeSimple.CHOICE === type
			) {
				if (!options?.length && !required) return false;
			}

			return true;
		})
	);

	/**
	 * Get input title
	 * If no title is provided then it takes one of the suggested options
	 */
	function getSuggestedTitle({ type, title, required }: FormInputClass): string {
		if (!title) {
			switch (type) {
				case eFormType.LOCATION:
					title = t("form_location");
					break;
				case eFormType.NEW_PASSWORD:
					title = t("form_desired_password");
					break;
				case eFormType.PASSWORD:
					title = t("form_password");
					break;
				case eFormType.ID:
					title = t("form_id_number");
					break;
				case eFormType.PHONE:
					title = t("form_phone_line");
					break;
				case eFormType.CELLPHONE:
					title = t("form_cellphone");
					break;
				case eFormType.EMAIL:
					title = t("form_email");
					break;
			}
		} else title = tet(title);

		if (required && title) title += "*";

		return title || "";
	}

	function getInvalid(name: string): iInvalidInput | undefined {
		return props.invalid?.find((invalid) => invalid.name === name);
	}

	// lifecycle
	watch(
		() => props.payload,
		(newPayload, oldPayload) => {
			if (!props.make || (firstMake.value && _.isEqual(newPayload, oldPayload))) return;

			firstMake.value = true;
			emit("update:model-value", props.make(...(<P>(newPayload || []))));
		},
		{ immediate: true }
	);
</script>
