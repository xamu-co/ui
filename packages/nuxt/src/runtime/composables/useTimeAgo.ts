/* eslint-disable import/no-unresolved */

import { timeAgo } from "@open-xamu-co/ui-common-helpers";

import { useAppConfig } from "#imports";

/**
 * Time ago composable
 */
export function useTimeAgo(date: Date) {
	const { xamu } = useAppConfig();

	const lang = xamu?.lang || "en";
	const country = xamu?.country || "US";

	return timeAgo(date, `${lang}-${country}`);
}
