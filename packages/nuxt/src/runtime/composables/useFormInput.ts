/* eslint-disable import/no-unresolved */

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";
import { useForm } from "@open-xamu-co/ui-common-helpers";

import { useAppConfig } from "#imports";

/**
 * xamu form composable
 */
export function useFormInput(): ReturnType<typeof useForm> {
	const { xamu } = useAppConfig();

	return useForm(xamu as iPluginOptions);
}
