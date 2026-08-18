import type { IconName } from "@fortawesome/fontawesome-common-types";

import { eFormTypeBase, eFormTypeComplex, eFormTypeSimple } from "@open-xamu-co/ui-common-enums";

import type { iSelectOption } from "../values.js";

export interface iFormOption extends iSelectOption {
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

export interface iIndicative extends iFormOption {
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

export type tTextInputType =
	| "text"
	| "email"
	| "password"
	| "search"
	| "url"
	| "number"
	| "tel"
	| "date"
	| "datetime-local"
	| "time";

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

export type iFormValue = string | number | boolean | File | Date;

/**
 * Simple input
 */
export interface iFormInputDefault<
	T extends eFormTypeBase | eFormTypeSimple | eFormTypeComplex = eFormTypeSimple,
> {
	type?: T;
	required?: boolean;
	/**
	 * String without the dots
	 */
	placeholder?: string;
	icon?: IconName | tFormIcon;
	autocomplete?: tFormAutocomplete;
}

export type tOptionsLoaderFn =
	| ((v?: string | number, signal?: AbortSignal) => iFormOption[])
	| ((v?: string | number, signal?: AbortSignal) => Promise<iFormOption[]>);

/** If a function is given, it should be responsible of determining if v is a value or an alias (search) */
export type iFormInputOptions = (string | number | iFormOption)[] | tOptionsLoaderFn;

/**
 * Complex input, sub input support
 * Used as input for the classes
 */
export interface iFormInput<
	V extends iFormValue | iFormValue[],
	T extends eFormTypeBase | eFormTypeSimple | eFormTypeComplex,
> extends iFormInputDefault<T> {
	name: string;
	/**
	 * Options for select, checkbox, radio inputs
	 * The usage of a function requires a compatible component (SelectFilter)
	 *
	 * @values array of options or function that returns options
	 */
	options?: iFormInputOptions;
	/**
	 * An array of values to simplify validation
	 *
	 * @old value
	 */
	values?: V[];
	defaults?: [
		iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>,
		iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>,
		...iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>[],
	];
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
	/**
	 * If multiple options are accepted, whether to accept or not duplicate values.
	 */
	unique?: boolean;
	/**
	 * if muliple is set to true this optional value would be the required minimun amount of values
	 */
	min?: number;
	/**
	 * if multiple is set to true this optional value would be the mandatory maximun amount of values
	 */
	max?: number;
	/**
	 * Additional input metadata
	 */
	meta?: Record<string, any>;
}

/**
 * Sended form values
 */
export interface iFormResponse<R = any> {
	response?: R;
	invalidInputs: iInvalidInput[];
	/**
	 * If the request had any error (validation/request itself).
	 */
	withErrors: boolean;
	/**
	 * If the request had any error.
	 */
	requestHadErrors: boolean;
	/**
	 * If the validation had any error.
	 */
	validationHadErrors: boolean;
	/**
	 * Errors payload,
	 * 401 will be reported but not failed
	 */
	errors?: any;
}

export interface iFetchResponse<R = any> {
	data?: R;
	errors?: any;
	[x: string]: any;
}

/**
 * Takes the parsed inputs values and perform a request (content creation, update, etc).
 *
 * @param values Values of the input
 * @param fetcher Request function
 * @returns Response with data and errors if any
 */
export type tResponseFn<T, V extends Record<string, any> = Record<string, any>> = (
	values: V
) => Promise<iFetchResponse<T>>;
