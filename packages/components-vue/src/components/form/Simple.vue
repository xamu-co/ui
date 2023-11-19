<template>
	<LoaderContentFetch
		v-slot="countries"
		:theme="theme"
		:promise="((withLocationInput && !defaultCountry) || withPhoneInput) && getCountries"
		class="flx --flxColumn --flx-start-stretch --gap-10 --gap:md --maxWidth-full"
		:fallback="[]"
		:el="noForm ? 'fieldset' : 'form'"
	>
		<LoaderContentFetch
			v-slot="states"
			:theme="theme"
			:promise="
				withLocationInput &&
				!!defaultCountry &&
				(() => getCountryStates(defaultCountry || ''))
			"
			:fallback="[]"
			unwrap
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
					:theme="theme"
					:input="input"
					:invalid="getInvalid(input.name)"
					:countries="countries.content"
					:states="(withLocationInput && !!defaultCountry && states.content) || undefined"
					:model-value="model[inputIndex].values"
					@update:model-value="updateValues(inputIndex, $event)"
				/>
			</div>
		</LoaderContentFetch>
	</LoaderContentFetch>
</template>

<script setup lang="ts">
	import { computed, watch } from "vue";
	import _ from "lodash";

	import type { iInvalidInput } from "@open-xamu-co/ui-common-types";
	import { eFormType, eFormTypeSimple } from "@open-xamu-co/ui-common-enums";
	import { FormInput as FormInputClass, useI18n } from "@open-xamu-co/ui-common-helpers";

	import FormInput from "./Input.vue";
	import LoaderContentFetch from "../loader/ContentFetch.vue";

	import type { iUseThemeProps } from "../../types/props";
	import useCountries from "../../composables/countries";
	import useHelpers from "../../composables/helpers";

	interface iFormSimple extends iUseThemeProps {
		title?: string;
		modelValue?: FormInputClass[];
		noForm?: boolean;
		invalid?: iInvalidInput[];
		/**
		 * Make model
		 */
		make?: FormInputClass[];
	}

	/**
	 * Factory component for forms
	 *
	 * @component
	 */

	defineOptions({ name: "FormSimple", inheritAttrs: true });

	const props = defineProps<iFormSimple>();
	const emit = defineEmits(["update:invalid", "update:model-value"]);

	const { t, tet } = useHelpers(useI18n);
	const { defaultCountry, getCountries, getCountryStates } = useCountries();

	const withLocationInput = computed(() => {
		return props.modelValue?.some(({ type }) => type === eFormType.LOCATION);
	});
	const withPhoneInput = computed(() => {
		return props.modelValue?.some(({ type }) => {
			return type === eFormType.CELLPHONE || type === eFormType.PHONE;
		});
	});

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
		() => props.make,
		(newMake, oldMake) => {
			if (oldMake && newMake?.every((input, index) => input.isEqual(oldMake[index]))) return;

			emit("update:model-value", newMake);
		},
		{ immediate: true }
	);
</script>
