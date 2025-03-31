import type {
	tFormAutocomplete,
	tFormInput,
	tLocaleForm,
	tTextInputType,
} from "@open-xamu-co/ui-common-types";
import { useI18n } from "@open-xamu-co/ui-common-helpers";
import { eFormType } from "@open-xamu-co/ui-common-enums";

import { useHelpers } from "../composables/utils";

export default function useInput({ input }: { input: tFormInput }) {
	const { t, tet } = useHelpers(useI18n);

	/**
	 * custom error message
	 * TODO: support warning messages
	 */
	function getInputError(): string {
		switch (input.type) {
			case eFormType.EMAIL:
				return t("form_use_valid_email");
			case eFormType.PHONE:
				return t("form_use_valid_phone");
			case eFormType.CELLPHONE:
				return t("form_use_valid_cellphone");
			case eFormType.NEW_PASSWORD:
				return t("form_unmatching_passwords");
			default:
				return t("form_invalid_data");
		}
	}
	/**
	 * get valid text input type
	 * @values "text", "email", "password", "search", "url", "number", "tel"
	 */
	function getInputTextType(): tTextInputType {
		switch (input.type) {
			case eFormType.PASSWORD:
				return "password";
			case eFormType.EMAIL:
				return "email";
			case eFormType.NUMBER:
				return "number";
			case eFormType.PHONE:
			case eFormType.CELLPHONE:
				return "tel";
			default:
				return "text";
		}
	}
	/**
	 * Get input placeholder
	 * If no placeholder is provided then it takes one of the suggested options
	 */
	function getInputPlaceholder(index = 0): string {
		/**
		 * Add ellipsis
		 */
		const p = (s: keyof tLocaleForm): string => {
			if (input.placeholder) return `${tet(input.placeholder).replace("...", "")}...`;

			return `${t(s)}...`;
		};

		switch (input.type) {
			case eFormType.LOCATION:
				return [p("form_country"), p("form_state"), p("form_city")][index];
			case eFormType.NEW_PASSWORD:
				return [p("form_desired_password"), p("form_confirm_password")][index];
			case eFormType.PASSWORD:
				return [p("form_password")][index];
			case eFormType.EMAIL:
				return [p("form_email")][index];
			case eFormType.PHONE:
				return [p("form_phone_line")][index];
			case eFormType.CELLPHONE:
				return [p("form_cellphone")][index];
			case eFormType.ID:
				return [p("form_id_number")][index];
			default:
				return [p("form_complete_the_field")][index];
		}
	}
	/**
	 * get valid input autocomplete string
	 */
	function getInputAutocomplete(): tFormAutocomplete {
		if (input.autocomplete) return input.autocomplete;

		switch (input.type) {
			case eFormType.NEW_PASSWORD:
				return "new-password";
			case eFormType.PASSWORD:
				return "current-password";
			case eFormType.EMAIL:
				return "email";
			case eFormType.PHONE:
				return "tel-local";
			case eFormType.CELLPHONE:
				return "tel-national";
			default:
				return "on";
		}
	}

	return {
		getInputError,
		getInputAutocomplete,
		getInputPlaceholder,
		getInputTextType,
	};
}
