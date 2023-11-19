import { inject } from "vue";

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

export default function useHelper<T>(helper: (o?: iPluginOptions) => T): T {
	const xamuOptions = inject<iPluginOptions>("xamu");

	return helper(xamuOptions);
}
