import DefaultSwal, {
	type SweetAlertOptions,
	type SweetAlertResult,
} from "sweetalert2/dist/sweetalert2";

import type { iPluginOptions, tSwal, tSwalOptions } from "@open-xamu-co/ui-common-types";

import useI18n from "./i18n";

function getTarget(possibleTarget?: tSwalOptions["target"]): string | HTMLElement {
	let dialog: HTMLElement | undefined | null;

	if (typeof possibleTarget !== "string") {
		if (possibleTarget instanceof Event) {
			dialog = (possibleTarget?.target as HTMLElement | undefined)?.closest("dialog");
		} else {
			dialog = possibleTarget?.closest("dialog");
		}
	} else {
		return possibleTarget || "body";
	}

	return dialog || "body";
}

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

	const swalDefaults: SweetAlertOptions = Object.assign(
		{
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
		},
		swal?.overrides,
		overrides
	);
	const swalPreventDefaults: SweetAlertOptions = Object.assign(
		{},
		swalDefaults,
		{
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
		},
		swal?.preventOverrides
	);
	const swalLoaderDefaults: SweetAlertOptions = Object.assign(
		{},
		swalDefaults,
		{
			title: t("loading"),
			text: t("swal.dont_close_window"),
			timer: undefined,
			willOpen: () => Swal.showLoading(),
			allowOutsideClick: () => !Swal.isLoading(),
			allowEscapeKey: () => !Swal.isLoading(),
		},
		options.internals?.debug
			? {
					showDenyButton: true,
					denyButtonText: t("swal.cancel"),
					customClass: { denyButton: "link" },
				}
			: {},
		swal?.loaderOverrides
	);
	const swalToastDefaults: SweetAlertOptions = Object.assign(
		{},
		swalDefaults,
		{
			toast: true,
			position: "bottom-right",
			timerProgressBar: true,
		},
		swal?.toastOverrides
	);

	const Swal = <tSwal>DefaultSwal.mixin({});

	Swal.fire = function <T>(swalOverrides: tSwalOptions = {}) {
		const overrides: SweetAlertOptions = Object.assign({}, swalDefaults, swalOverrides);

		overrides.target = getTarget(overrides.target);

		return <Promise<SweetAlertResult<Awaited<T>>>>DefaultSwal.fire(overrides);
	};

	Swal.firePrevent = function <T>(swalPreventOverrides: tSwalOptions = {}) {
		const overrides = Object.assign({}, swalPreventDefaults, swalPreventOverrides);

		overrides.target = getTarget(overrides.target);

		return <Promise<SweetAlertResult<Awaited<T>>>>DefaultSwal.fire(overrides);
	};

	Swal.fireLoader = function <T>(swalLoaderOverrides: tSwalOptions = {}) {
		const overrides = Object.assign({}, swalLoaderDefaults, swalLoaderOverrides);

		overrides.target = getTarget(overrides.target);

		return <Promise<SweetAlertResult<Awaited<T>>>>DefaultSwal.fire(overrides);
	};

	Swal.fireToast = function <T>(swalToastOverrides: tSwalOptions = {}) {
		const overrides = Object.assign({}, swalToastDefaults, swalToastOverrides);

		overrides.target = getTarget(overrides.target);

		return <Promise<SweetAlertResult<Awaited<T>>>>DefaultSwal.fire(overrides);
	};

	return Swal;
}
