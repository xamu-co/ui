/* eslint-disable import/no-unresolved */

import type { iVuePluginOptions } from "@open-xamu-co/ui-components-vue/plugin";

import { defineNuxtPlugin, useAppConfig, useAsyncData } from "#imports";
import { NuxtLink, NuxtImg } from "#components";

export default defineNuxtPlugin(({ vueApp }) => {
	const config = useAppConfig();
	const xamu: iVuePluginOptions = {
		routerComponent: NuxtLink,
		imageComponent: NuxtImg,
		asyncDataFn: useAsyncData,
		// override defaults
		...(config.xamu as iVuePluginOptions),
	};

	vueApp.provide("xamu", xamu);

	return { provide: { xamu } };
});
