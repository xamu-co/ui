import { timeAgo } from "@open-xamu-co/ui-common-helpers";

/**
 * Time ago composable
 */
export function useTimeAgo(date: Date) {
	const { xamu } = useAppConfig();

	const lang = xamu?.lang || "en";
	const country = xamu?.country || "US";

	return timeAgo(date, `${lang}-${country}`);
}
