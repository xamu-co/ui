/* eslint-disable import/no-unresolved */

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";
import { useForm } from "@open-xamu-co/ui-common-helpers";

import { useRuntimeConfig } from "#imports";

/**
 * xamu form composable
 */
export function useFormInput(): ReturnType<typeof useForm> {
	const xamu = useRuntimeConfig().public.xamu as iPluginOptions;

	return useForm(xamu);
}
