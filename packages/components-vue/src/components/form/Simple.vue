<template>
	<BaseErrorBoundary :theme="theme">
		<component
			:is="noForm ? 'fieldset' : 'form'"
			v-if="model.length"
			class="flx --flxColumn --flx-start-stretch --gap-10 --maxWidth-full"
		>
			<legend v-if="title">
				<h4>{{ title }}:</h4>
			</legend>
			<BaseWrapper
				v-slot="{ content, ...countriesAndStatesReq } = {}"
				:wrapper="LoaderContentFetch"
				:wrap="withLocationInput || withPhoneInput"
				:theme="theme"
				:label="t('form_loading_countries')"
				:promise="getCountriesAndStates"
				:url="`/countries${defaultCountry ? '?states' : ''}`"
				:fallback="{ countries: [], states: [] }"
				ignore-errors
				unwrap
			>
				<template v-for="(input, inputIndex) in model" :key="inputIndex">
					<div
						v-if="input && model[inputIndex] && input.type !== eFormType.HIDDEN"
						class="flx --flxColumn --flx-start-stretch --gap-5"
					>
						<p v-if="getSuggestedTitle(input)" class="--txtSize-sm">
							{{ getSuggestedTitle(input) }}
						</p>
						<FormInput
							:key="`input-${input.name}-${input.options.length}`"
							v-bind="{
								...content,
								...countriesAndStatesReq,
								readonly,
								theme,
								input,
							}"
							:invalid="getInvalid(input.name)"
							:model-value="model[inputIndex].values"
							@update:model-value="updateValues(inputIndex, $event)"
						/>
					</div>
				</template>
			</BaseWrapper>
		</component>
		<slot v-else>
			<!-- No inputs given -->
			<BaseBox class="--width-100" :theme="theme" button dashed transparent>
				<div class="flx --flxRow --flx-center">
					<span>{{ emptyMessage || t("nothing_to_show") }}</span>
				</div>
			</BaseBox>
		</slot>
	</BaseErrorBoundary>
</template>

<script setup lang="ts" generic="P extends any[] = any[]">
	import { computed, ref, watch } from "vue";
	import isEqual from "lodash-es/isEqual";

	import type { iInvalidInput } from "@open-xamu-co/ui-common-types";
	import type { tFormInput } from "@open-xamu-co/ui-common-types";
	import { eFormType, eFormTypeSimple } from "@open-xamu-co/ui-common-enums";
	import { useI18n } from "@open-xamu-co/ui-common-helpers";

	import BaseWrapper from "../base/Wrapper.vue";
	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import BaseBox from "../base/Box.vue";
	import FormInput from "./Input.vue";
	import LoaderContentFetch from "../loader/ContentFetch.vue";

	import type { iUseThemeProps } from "../../types/props";
	import type { iState } from "../../types/countries";
	import useCountries from "../../composables/countries";
	import { useHelpers } from "../../composables/utils";

	export interface iFormSimple<P extends any[]> extends iUseThemeProps {
		title?: string;
		emptyMessage?: string;
		modelValue?: tFormInput[];
		noForm?: boolean;
		invalid?: iInvalidInput[];
		/**
		 * If the make function requires a payload
		 */
		payload?: P;
		/**
		 * Make model
		 */
		make?: (...args: P) => tFormInput[];
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
		return !!props.modelValue?.some(({ type }) => type === eFormType.LOCATION);
	});
	const withPhoneInput = computed(() => {
		return !!props.modelValue?.some(({ type }) => {
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
		if (!model.value[index]) return;

		// update values
		model.value[index].values = values;
		emit("update:model-value", props.modelValue?.toSpliced(index, 1, model.value[index]));

		if (!props.invalid?.length) return;

		// update invalid
		emit(
			"update:invalid",
			props.invalid.filter(({ invalidValue, name }) => {
				return model.value[index]?.name !== name || isEqual(invalidValue, values);
			})
		);
	}

	/**
	 * Form model
	 * Maps valid inputs as null. To preserve indexes
	 */
	const model = computed<(tFormInput | null)[]>(() =>
		(props.modelValue || []).map((input) => {
			const { type, options, required } = input;

			// omit non required if options are not present
			if (
				eFormTypeSimple.SELECT === type ||
				eFormTypeSimple.SELECT_FILTER === type ||
				eFormTypeSimple.CHOICE === type
			) {
				if (!options?.length && !required) return null;
			}

			return input;
		})
	);

	/**
	 * Get input title
	 * If no title is provided then it takes one of the suggested options
	 */
	function getSuggestedTitle({ type, title, required }: tFormInput): string {
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
			if (!props.make || (firstMake.value && isEqual(newPayload, oldPayload))) return;

			firstMake.value = true;
			emit("update:model-value", props.make(...(<P>(newPayload || []))));
		},
		{ immediate: true }
	);
</script>
