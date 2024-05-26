import DefaultSwal, { type SweetAlertOptions, type SweetAlertResult } from "sweetalert2";

export type tSwalOptions = Omit<SweetAlertOptions, "target"> & {
	target?: SweetAlertOptions["target"] | Event;
};

/**
 * Extended SweetAlert2 class
 *
 * Defaults should use Event as target
 *
 * Do not deestructure this
 */
export type tSwal = Omit<typeof DefaultSwal, "fire"> & {
	fire: <T = any>(options?: tSwalOptions) => Promise<SweetAlertResult<Awaited<T>>>;
	firePrevent: <T = any>(options?: tSwalOptions) => Promise<SweetAlertResult<Awaited<T>>>;
	fireLoader: <T = any>(options?: tSwalOptions) => Promise<SweetAlertResult<Awaited<T>>>;
	firePreventDefaults: SweetAlertOptions;
	fireLoaderDefaults: SweetAlertOptions;
};
