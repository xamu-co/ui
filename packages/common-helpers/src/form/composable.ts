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
		silent = false,
		plainValues = true
	): Promise<iFormResponse<R, HTMLElement | string>> {
		const { values, invalidInputs } = getFormValues<RV>(inputs, plainValues);
		const modalTarget = (event?.target as HTMLElement)?.closest("dialog") || "body";
		const withSwal = !silent && isBrowser;
		let errors;
		let requestHadErrors = false;
		let newResponse: iFetchResponse<R> = {};

		if (!invalidInputs.length) {
			try {
				if (withSwal) Swal.fireLoader({ target: modalTarget });

				newResponse = await request(values);
				// request went ok, but still returned errors
				errors = newResponse.errors;

				// empty response can be server error
				if (newResponse.data === null || newResponse.data === undefined) {
					requestHadErrors = true;
				}
			} catch (err) {
				// Network error probably

				errors = err;
				// eslint-disable-next-line no-console
				console.error(err);

				if (withSwal) {
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

				return {
					invalidInputs,
					withErrors: true,
					requestHadErrors: true,
					validationHadErrors: false,
					errors,
					modalTarget,
				};
			}
		} else if (withSwal) {
			// invalid input filling
			Swal.fire({
				title: t("swal.incomplete_data"),
				text: t("swal.incomplete_data_message"),
				icon: "warning",
				target: modalTarget,
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
