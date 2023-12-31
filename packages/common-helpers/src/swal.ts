import DefaultSwal, {
	type SweetAlertOptions,
	type SweetAlertResult,
} from "sweetalert2/dist/sweetalert2.js";

import type { iPluginOptions, tSwal } from "@open-xamu-co/ui-common-types";

import useI18n from "./i18n.js";

/**
 * Swal composable
 *
 * @example Swal.fire({text: 'My message'});
 * @composable
 *
 * @returns Swal class
 */
export default function useSwal(options: iPluginOptions = {}, overrides: SweetAlertOptions = {}) {
	const { t } = useI18n(options);
	const { swal } = options;
	const swalDefaults: SweetAlertOptions = {
		timer: 1700,
		showConfirmButton: false,
		heightAuto: false,
		reverseButtons: true,
		buttonsStyling: false,
		cancelButtonText: t("swal.cancel"),
		allowOutsideClick: () => !Swal.isLoading(),
		allowEscapeKey: () => !Swal.isLoading(),
		customClass: {
			confirmButton: "bttn",
			cancelButton: "bttnToggle",
			denyButton: "link",
		},
	};
	const swalDefaultsOverrides: SweetAlertOptions = Object.assign(
		{},
		swalDefaults,
		swal?.overrides,
		overrides
	);
	const Swal = <tSwal>DefaultSwal.mixin(swalDefaultsOverrides);
	const swalFirePreventDefaults: SweetAlertOptions = {
		icon: "warning",
		timer: undefined,
		showCancelButton: true,
		showConfirmButton: true,
		confirmButtonText: t("swal.continue"),
		allowOutsideClick: () => !Swal.isLoading(),
		allowEscapeKey: () => !Swal.isLoading(),
		customClass: {
			confirmButton: ["bttn", "--tm-danger-light"],
			cancelButton: "bttnToggle",
			denyButton: "link",
		},
	};
	const swalFireLoaderDefaults: SweetAlertOptions = {
		title: t("loading"),
		text: t("swal.dont_close_window"),
		timer: undefined,
		willOpen: () => Swal.showLoading(),
		allowOutsideClick: () => !Swal.isLoading(),
		allowEscapeKey: () => !Swal.isLoading(),
	};
	const swalFirePreventOverrides = { ...swalFirePreventDefaults, ...swal?.preventOverrides };
	const swalFireLoaderOverrides = { ...swalFireLoaderDefaults, ...swal?.loaderOverrides };

	Swal.firePrevent = function <T>(firePreventOverrides: SweetAlertOptions = {}) {
		const overrides = Object.assign({}, swalFirePreventOverrides, firePreventOverrides);

		return <Promise<SweetAlertResult<Awaited<T>>>>Swal.fire(overrides);
	};

	Swal.fireLoader = function <T>(fireLoaderOverrides: SweetAlertOptions = {}) {
		const overrides = Object.assign({}, swalFireLoaderOverrides, fireLoaderOverrides);

		return <Promise<SweetAlertResult<Awaited<T>>>>Swal.fire(overrides);
	};

	return Swal;
}
