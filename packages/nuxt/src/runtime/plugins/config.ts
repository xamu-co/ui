/* eslint-disable import/no-unresolved */

import type { iVuePluginOptions } from "@open-xamu-co/ui-components-vue/plugin";
import type { tLogger } from "@open-xamu-co/ui-common-types";

import { defineNuxtPlugin, useAppConfig, useAsyncData } from "#imports";
import { NuxtLink, NuxtImg } from "#components";

export default defineNuxtPlugin(({ vueApp }) => {
	const options = useAppConfig().xamu as iVuePluginOptions;
	const xamu: iVuePluginOptions = {
		routerComponent: NuxtLink,
		imageComponent: NuxtImg,
		asyncDataFn: useAsyncData,
		// override defaults
		...options,
	};

	// Logger with nuxt context
	if (options.logger) {
		xamu.logger = (...args: Parameters<tLogger>) => options.logger?.(...args);
	}

	vueApp.provide("xamu", xamu);

	return { provide: { xamu } };
});
