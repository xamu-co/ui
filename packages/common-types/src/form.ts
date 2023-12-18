import type { IconName } from "@fortawesome/fontawesome-common-types";

import { eFormTypeComplex, eFormTypeSimple } from "@open-xamu-co/ui-common-enums";

export interface iSelectOption {
	value: string | number;
	alias?: string;
	selected?: boolean;
	/**
	 * Font awesome icon
	 */
	icon?: IconName;
	/**
	 * Color or image url
	 */
	pattern?: string;
	placeholder?: string;
}

export interface iIndicative extends iSelectOption {
	code: string;
	number: number;
}

export interface iInvalidInput {
	name: string;
	invalidValue: unknown[];
}

/**
 * Form Values to be send
 */
export interface iFormResults<T = Record<string, unknown>> {
	values: T;
	invalidInputs: iInvalidInput[];
}

export type tTextInputType = "text" | "email" | "password" | "search" | "url" | "number" | "tel";

export type tFormAutocomplete =
	| "off"
	| "on"
	| "name"
	| "honorific-prefix"
	| "given-name"
	| "additional-name"
	| "family-name"
	| "honorific-suffix"
	| "nickname"
	| "email"
	| "username"
	| "new-password"
	| "current-password"
	| "one-time-code"
	| "organization-title"
	| "organization"
	| "street-address"
	| "address-line1"
	| "address-line2"
	| "address-line3"
	| "address-level4"
	| "address-level3"
	| "address-level2"
	| "address-level1"
	| "country"
	| "country-name"
	| "postal-code"
	| "cc-name"
	| "cc-given-name"
	| "cc-additional-name"
	| "cc-family-name"
	| "cc-number"
	| "cc-exp"
	| "cc-exp-month"
	| "cc-exp-year"
	| "cc-csc"
	| "cc-type"
	| "transaction-currency"
	| "transaction-amount"
	| "language"
	| "bday"
	| "bday-day"
	| "bday-month"
	| "bday-year"
	| "sex"
	| "tel"
	| "tel-country-code"
	| "tel-national"
	| "tel-area-code"
	| "tel-local"
	| "tel-extension"
	| "impp"
	| "url";

export type iFormIconProps = { brand?: boolean; regular?: boolean };

export type tFormIcon = [IconName | undefined, iFormIconProps];

export type iFormValue = string | number | boolean | File;

/**
 * Simple input
 */
export interface iFormInputDefault<T extends eFormTypeSimple | eFormTypeComplex = eFormTypeSimple> {
	required?: boolean;
	type?: T;
	options?: (string | number | iSelectOption)[];
	/**
	 * String without the dots
	 */
	placeholder?: string;
	icon?: IconName | tFormIcon;
	autocomplete?: tFormAutocomplete;
	/**
	 * if muliple is set to true this optional value would be the required minimun amount of values
	 */
	min?: number;
	/**
	 * if multiple is set to true this optional value would be the mandatory maximun amount of values
	 */
	max?: number;
}

/**
 * Complex input, sub input support
 */
export interface iFormInput<V extends iFormValue = iFormValue>
	extends iFormInputDefault<eFormTypeSimple | eFormTypeComplex> {
	name: string;
	/**
	 * An array of values to simplify validation
	 *
	 * @old value
	 */
	values?: (V | V[])[];
	defaults?: [iFormInputDefault, iFormInputDefault, ...iFormInputDefault[]];
	/**
	 * Visible over the field, should describe it
	 */
	title?: string;
	/**
	 * input is of type array
	 * to require a range or a fixed amount use alongside min & max
	 *
	 * Ex: { multiple: true, min:3, max:3 } would make 3 values a requirement
	 */
	multiple?: boolean;
}