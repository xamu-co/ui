import type {
	iFetchResponse,
	iFormResponse,
	iPluginOptions,
	tResponseFn,
} from "@open-xamu-co/ui-common-types";

import useI18n from "../i18n.js";
import useUtils from "../utils.js";
import useSwal from "../swal.js";
import {
	getFormInputsInvalids,
	getFormInputsValues,
	getFormValues,
	getInputSuffixes,
	isValidFormInputValue,
	isValidValue,
	notEmptyValue,
} from "./utils.js";
import { FormInput } from "./input.js";

/**
 * Form Composable
 *
 * @composable
 */
export default function useForm(options: iPluginOptions = {}) {
	const { t } = useI18n(options);
	const { isBrowser } = useUtils(options);
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
		inputs: RV | FormInput[] = [],
		event?: Event,
		plainValues = true
	): Promise<iFormResponse<R, HTMLElement | string>> {
		const { values, invalidInputs } = getFormValues<RV>(inputs, plainValues);
		const modalTarget = (event?.target as HTMLElement)?.closest("dialog") || "body";
		let errors;
		let requestHadErrors = false;
		let newResponse: iFetchResponse<R> = {};

		if (!invalidInputs.length) {
			try {
				if (isBrowser) Swal.fireLoader({ target: modalTarget });

				newResponse = await request(values);

				if (newResponse?.errors) {
					errors = newResponse.errors;

					if (errors || !newResponse.data) requestHadErrors = true;
				}
			} catch (err) {
				/**
				 * Network error probably
				 */
				errors = err;
				requestHadErrors = true;
				// eslint-disable-next-line no-console
				console.error(err);

				if (isBrowser) {
					const { value } = await Swal.fire({
						title: t("swal.connection_error"),
						text: t("swal.connection_error_message"),
						icon: "error",
						timer: undefined,
						showConfirmButton: true,
						confirmButtonText: t("swal.connection_error_confirm"),
						target: modalTarget,
					});

					// Page reload if user wish to
					if (value) location.reload();
				}
			}
		} else if (isBrowser) {
			// invalid input filling
			Swal.fire({
				title: t("swal.incomplete_data"),
				text: t("swal.incomplete_data_message"),
				icon: "warning",
				target: modalTarget,
			});
		}

		const validationHadErrors = invalidInputs.length > 0 || !!(errors && !requestHadErrors);
		const withErrors = requestHadErrors || validationHadErrors;
		const response = newResponse.data;

		// hide loader
		if (isBrowser && !validationHadErrors && response) Swal.close();

		return {
			response,
			invalidInputs,
			withErrors,
			requestHadErrors,
			validationHadErrors,
			errors,
			modalTarget,
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
