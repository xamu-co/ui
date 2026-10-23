/* eslint-disable import/no-unresolved */

import type { SweetAlertOptions } from "sweetalert2/dist/sweetalert2";

import { useSwal as originalUseSwal } from "@open-xamu-co/ui-common-helpers";
import type { iPluginOptions, tSwal } from "@open-xamu-co/ui-common-types";

import { useRuntimeConfig } from "#imports";

/**
 * Extended SweetAlert2 composable
 */
export function useSwal(overrides: SweetAlertOptions = {}): tSwal {
	const xamu = useRuntimeConfig().public.xamu as iPluginOptions;

	return originalUseSwal(xamu, overrides);
}
