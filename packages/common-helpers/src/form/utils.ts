import isEmail from "validator/lib/isEmail";

import type {
	iFormInputDefault,
	iFormValue,
	iFormResults,
	iInvalidInput,
} from "@open-xamu-co/ui-common-types";
import { eFormType, eFormTypeComplex, eFormTypeSimple } from "@open-xamu-co/ui-common-enums";

import { FormInput } from "./input";

/**
 * Wheter or not value is empty
 * @param value any value
 * @returns {boolean}
 */
export function notEmptyValue<V extends iFormValue = iFormValue>(
	value: V | V[],
	defaults?: [iFormInputDefault, iFormInputDefault, ...iFormInputDefault[]]
): boolean {
	if (Array.isArray(value)) {
		// if not required bypass
		if (!value.length) return false;

		return value.every((v, i) => notEmptyValue(v) || (defaults && !defaults?.[i]?.required));
	} else if (!value && value !== false && value !== 0) return false;

	return true;
}

/**
 * check if single FormInput value from values is valid
 */
export function isValidValue<V extends iFormValue = iFormValue>(
	value: V | V[],
	input: FormInput
): boolean {
	// empty values are falsy
	if (!notEmptyValue(value, input.defaults)) return false;

	// field not empty, validate
	switch (input.type) {
		case eFormType.PHONE:
			// TODO: improve phone & cellphone validation
			return Array.isArray(value) && value[1].toString().length >= 7;
		case eFormType.CELLPHONE:
			return Array.isArray(value) && value[1].toString().length === 10;
		case eFormType.NEW_PASSWORD:
			return Array.isArray(value) && value[0] === value[1];
		case eFormType.EMAIL:
			return typeof value === "string" && isEmail(value);
		default:
			// no validation required, assume true
			return true;
	}
}

/**
 * Check if FormInput value is valid
 *
 * Array.every is truthy for empty arrays
 */
export const isValidFormInputValue = (input: FormInput, ignoreRequired = false): boolean => {
	const { values, multiple, type, required, min, max } = input;

	// When required, false if empty array
	if ((!values || !values.length) && required && !ignoreRequired) return false;

	if (multiple) {
		// Bypass if not required
		// The UI should ensure the limits are not surpased
		if (required && !ignoreRequired) {
			if (values.length < min) return false;
			if (values.length > max) return false;
		}
	} else {
		if (type === eFormType.NUMBER) {
			// Number in range
			return values.every((number) => {
				number = Number(number);

				return number >= min && number <= max;
			});
		} else if (!type || type === eFormType.TEXT) {
			// String length in range
			return values.every((string) => {
				const length = String(string).length;

				return !string || (length >= min && length <= max);
			});
		}
	}

	// The actual values are valid
	const valid = values.every((value) => isValidValue(value, input));
	// All values have content
	const notEmpty = values.every((v) => notEmptyValue(v, input.defaults));

	// if empty but not required then value is truthy
	return valid || (!notEmpty && (!required || ignoreRequired));
};

/** suffixes used on values */
export function getInputSuffixes(
	type?: eFormTypeSimple | eFormTypeComplex
): [string, string, string?] {
	switch (type) {
		case eFormType.ID:
			return ["Type", "Number"];
		case eFormType.CELLPHONE:
		case eFormType.PHONE:
			return ["Indicative", "Number"];
		case eFormType.LOCATION:
			return ["Country", "State", "City"];
		default:
			return ["", ""];
	}
}
export function getFormInputsInvalids(inputs: FormInput[]): iInvalidInput[] {
	const invalidInputs: iInvalidInput[] = [];

	inputs.forEach((input) => {
		// Report as invalid if that is the case
		if (isValidFormInputValue(input)) return;

		invalidInputs.push({
			name: input.name,
			invalidValue: input.values || [],
		});
	});

	return invalidInputs;
}
/**
 * Reduces FormInput values into an object
 * @param inputs FormInput array
 * @param plainValues wheter or not to remove unnecesary arrays
 * @returns
 */
export function getFormInputsValues<V extends Record<string, any>>(
	inputs: FormInput[],
	plainValues = true
): V {
	return inputs.reduce((acc, input, index) => {
		// inadecuate format, ignore
		if (!input.name) throw new Error(`Missing name property on input with index ${index}`);
		else if (!Array.isArray(input.values) || !input.values.length) {
			/**
			 * Validation expects an array with at least one element
			 * SUGGESTION: reconsider this approach
			 */
			if (input.required) input.values = [""];
		}

		input.values.forEach((value) => {
			// Avoid adding if empty unless it is required
			if (!notEmptyValue(value, input.defaults) && !input.required) return;

			switch (input.type) {
				// return two of two values
				case eFormType.ID:
				case eFormType.PHONE:
				case eFormType.CELLPHONE:
				case eFormType.LOCATION: {
					if (!Array.isArray(value)) return;

					getInputSuffixes(input.type).forEach((suffix, index) => {
						const key: keyof V = input.name + suffix;
						const newValue = value[index];

						if (key in acc) {
							if (Array.isArray(acc[key])) acc[key].push(newValue);
						} else acc[key] = <V[keyof V]>[newValue];
					});

					break;
				}
				// return one or the first of two values
				default: {
					const arrValue = (v: unknown[]) => (input.defaults ? v : v[0]);
					const plainValue = (v: unknown) => {
						return input.type === eFormType.NUMBER ? Number(v) : v;
					};
					const key: keyof V = input.name;
					const newValue = Array.isArray(value) ? arrValue(value) : plainValue(value);

					if (key in acc) {
						if (Array.isArray(acc[key])) acc[key].push(newValue);
					} else acc[key] = <V[keyof V]>[newValue];

					break;
				}
			}
		});

		if (!input.multiple) {
			// Remove unnecessary arrays
			// The api expects simple data in some cases so this is a necessary step
			if (plainValues) {
				const key: keyof V = input.name;
				const entries = acc[key];

				if (Array.isArray(entries) && entries.length === 1) {
					acc[key] = entries[0];
				}
			}

			getInputSuffixes(input.type)
				.filter((suffix) => suffix)
				.forEach((suffix) => {
					const key: keyof V = input.name + suffix;
					const entries = acc[key];

					if (Array.isArray(entries) && entries.length === 1) acc[key] = entries[0];
				});
		}

		return acc;
	}, {} as V);
}

/**
 * Returns the actual data object to send to the api
 * @param inputs The form inputs.
 * @param plainValues Whether or not to remove unnecessary arrays.
 * @returns An object containing the form values and invalid inputs.
 */
export function getFormValues<V extends Record<string, any>>(
	inputs: V | FormInput[],
	plainValues = true
): iFormResults<V> {
	if (!Array.isArray(inputs)) return { values: inputs, invalidInputs: [] };

	/** Prevent proxying values */
	inputs = inputs.map((input) =>
		input.clone({
			values: (input.values?.slice() || []).map((x) => {
				if (!Array.isArray(x)) return x;

				return x.slice().map((y) => y);
			}),
		})
	);

	const values: V = getFormInputsValues(inputs, plainValues);
	const invalidInputs = getFormInputsInvalids(inputs).filter(({ name }) => {
		return values[name] !== undefined;
	});

	return {
		values,
		invalidInputs,
	};
}
