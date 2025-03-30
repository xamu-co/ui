import { type Ref, inject, onMounted, onBeforeUnmount, ref } from "vue";

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";
import { useUtils } from "@open-xamu-co/ui-common-helpers";

import { useHelpers } from "../composables/utils";

function MQHandler(range: Ref<boolean>) {
	return function (e: MediaQueryList | MediaQueryListEvent) {
		range.value = e.matches;
	};
}

function matchMedia(size?: number) {
	return window.matchMedia(`(max-width: ${size}px)`);
}

/**
 * Browser composable
 *
 * @composable
 */
export default function useBrowser() {
	const { mediaQueryPixels } = inject<iPluginOptions>("xamu") || {};
	const { isBrowser } = useHelpers(useUtils);

	// Viewports
	const laptopMqRange = ref<boolean>(false);
	const tabletMqRange = ref<boolean>(false);
	const mobileMqRange = ref<boolean>(false);
	// Viewport listeners
	const laptopMQHandler = MQHandler(laptopMqRange);
	const tabletMQHandler = MQHandler(tabletMqRange);
	const mobileMQHandler = MQHandler(mobileMqRange);

	// lifecycle, listeners only work on browser
	if (isBrowser) {
		// Define MQlist
		const laptopMQList = matchMedia(mediaQueryPixels?.laptop ?? 1080);
		const tabletMQList = matchMedia(mediaQueryPixels?.tablet ?? 768);
		const mobileMQList = matchMedia(mediaQueryPixels?.mobile ?? 576);

		onMounted(() => {
			// Mount listeners
			laptopMQList.addEventListener("change", laptopMQHandler, true);
			tabletMQList.addEventListener("change", tabletMQHandler, true);
			mobileMQList.addEventListener("change", mobileMQHandler, true);

			// Set initial values
			laptopMQHandler(laptopMQList);
			tabletMQHandler(tabletMQList);
			mobileMQHandler(mobileMQList);
		});

		onBeforeUnmount(() => {
			// Unmount listeners
			laptopMQList.removeEventListener("change", laptopMQHandler, true);
			tabletMQList.removeEventListener("change", tabletMQHandler, true);
			mobileMQList.removeEventListener("change", mobileMQHandler, true);
		});
	}

	return { laptopMqRange, tabletMqRange, mobileMqRange };
}
