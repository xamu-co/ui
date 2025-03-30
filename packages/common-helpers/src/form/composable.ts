import type {
	iFetchResponse,
	iFormResponse,
	iPluginOptions,
	tFormInput,
	tResponseFn,
} from "@open-xamu-co/ui-common-types";

import useI18n from "../i18n";
import useUtils from "../utils";
import useSwal from "../swal";
import {
	getFormInputsInvalids,
	getFormInputsValues,
	getFormValues,
	getInputSuffixes,
	isValidFormInputValue,
	isValidValue,
	notEmptyValue,
} from "./utils";

/**
 * Form Composable
 *
 * @composable
 */
export default function useForm(options: iPluginOptions = {}) {
	const { t } = useI18n(options);
	const { isBrowser, logger } = useUtils(options);
	const Swal = useSwal(options);

	/**
	 * Wraps callback function with common error handling
	 *
	 * @param inputs array of FormInput or actual data object
	 * @param callback actual request
	 * @returns {object} response with errors
	 */
	async function getResponse<R, RV extends Record<string, any> = Record<string, any>>(
		request: tResponseFn<R, RV>,
		inputs: RV | tFormInput[] = [],
		event?: Event,
		silent = false,
		plainValues = true
	): Promise<iFormResponse<R>> {
		const { values, invalidInputs } = getFormValues<RV>(inputs, plainValues);
		const withSwal = !silent && isBrowser;
		let errors;
		let requestHadErrors = false;
		let newResponse: iFetchResponse<R> = {};

		if (!invalidInputs.length) {
			try {
				if (withSwal) Swal.fireLoader({ target: event });

				newResponse = await request(values);
				// request went ok, but still returned errors
				errors = newResponse.errors;

				// empty response can be server error
				if (newResponse.data === null || newResponse.data === undefined) {
					requestHadErrors = true;
				}
			} catch (err) {
				// Network error probably
				const errorMessage = err instanceof Error ? err.message : "unknown error";

				errors = err;
				logger("useForm:getResponse", errorMessage, err);

				if (withSwal) {
					const { value } = await Swal.fire({
						title: t("swal.connection_error"),
						text: t("swal.connection_error_message"),
						icon: "error",
						timer: undefined,
						showConfirmButton: true,
						confirmButtonText: t("swal.connection_error_confirm"),
						target: event,
					});

					// Page reload if user wish to
					if (value) location.reload();
				}

				return {
					invalidInputs,
					withErrors: true,
					requestHadErrors: true,
					validationHadErrors: false,
					errors,
				};
			}
		} else if (withSwal) {
			// invalid input filling
			Swal.fire({
				title: t("swal.incomplete_data"),
				text: t("swal.incomplete_data_message"),
				icon: "warning",
				target: event,
			});
		}

		const validationHadErrors = invalidInputs.length > 0;
		const withErrors = !!errors || requestHadErrors || validationHadErrors;
		const response = newResponse.data;

		// success, hide loader
		if (withSwal && !validationHadErrors) Swal.close();

		return {
			response,
			invalidInputs,
			withErrors,
			requestHadErrors,
			validationHadErrors,
			errors,
		};
	}

	return {
		utils: {
			notEmptyValue,
			isValidValue,
			isValidFormInputValue,
			getInputSuffixes,
			getFormInputsInvalids,
			getFormInputsValues,
			getFormValues,
		},
		getResponse,
	};
}
