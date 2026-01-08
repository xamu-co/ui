/* eslint-disable import/no-unresolved */

import type { iVuePluginOptions } from "@open-xamu-co/ui-components-vue/plugin";

import { defineNuxtPlugin, useRuntimeConfig, useAsyncData } from "#imports";
import { NuxtLink, NuxtImg, ClientOnly } from "#components";

// Virtual file
import { withLogger, useXamuUILogger } from "#build/ui-nuxt.mjs";

export default defineNuxtPlugin(({ vueApp }) => {
	const options = useRuntimeConfig().public.xamu as iVuePluginOptions;
	const xamu: iVuePluginOptions = {
		routerComponent: NuxtLink,
		imageComponent: NuxtImg,
		// override defaults
		...options,
		internals: {
			useAsyncData,
			ofetch: $fetch,
			clientOnly: ClientOnly,
			debug: process.env.NODE_ENV !== "production",
			...options.internals,
		},
	};

	// Logger with nuxt context
	if (withLogger) xamu.logger = useXamuUILogger;

	vueApp.provide("xamu", xamu);

	return { provide: { xamu } };
});
