/* eslint-disable import/no-unresolved */

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";
import { timeAgo } from "@open-xamu-co/ui-common-helpers";

import { useRuntimeConfig } from "#imports";

/**
 * Time ago composable
 */
export function useTimeAgo(date: Date) {
	const xamu = useRuntimeConfig().public.xamu as iPluginOptions;

	const lang = xamu?.lang || "en";
	const country = xamu?.country || "US";

	return timeAgo(date, `${lang}-${country}`);
}
