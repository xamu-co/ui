/* eslint-disable import/no-unresolved */

import { useForm } from "@open-xamu-co/ui-common-helpers";

import { useAppConfig } from "#imports";

/**
 * xamu form composable
 */
export function useFormInput() {
	const { xamu } = useAppConfig();

	return useForm(xamu);
}
