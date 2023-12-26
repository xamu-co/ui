import DefaultSwal, {
	type SweetAlertOptions,
	type SweetAlertResult,
} from "sweetalert2/dist/sweetalert2.js";

/**
 * Extended SweetAlert2 class
 *
 * Do not deestructure this
 */
export type tSwal = typeof DefaultSwal & {
	firePrevent: <T = unknown>(
		options?: SweetAlertOptions
	) => Promise<SweetAlertResult<Awaited<T>>>;
	firePreventDefaults: SweetAlertOptions;
	fireLoader: <T = unknown>(options?: SweetAlertOptions) => Promise<SweetAlertResult<Awaited<T>>>;
	fireLoaderDefaults: SweetAlertOptions;
};
