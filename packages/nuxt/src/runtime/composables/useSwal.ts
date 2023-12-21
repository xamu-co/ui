import type { SweetAlertOptions } from "sweetalert2/dist/sweetalert2";

import { useSwal as originalUseSwal } from "@open-xamu-co/ui-common-helpers";
import type { tSwal } from "@open-xamu-co/ui-common-types";

/**
 * Extended SweetAlert2 composable
 */
export function useSwal(overrides: SweetAlertOptions = {}): tSwal {
	const { xamu } = useAppConfig();

	return originalUseSwal(xamu, overrides);
}
