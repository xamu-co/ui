/* eslint-disable import/no-unresolved */
import type { Component as VueComponent } from "vue";

import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

import { defineNuxtPlugin } from "#imports";
import { NuxtLink, NuxtImg } from "#components";

export default defineNuxtPlugin(({ vueApp }) => {
	const config = useRuntimeConfig().public;
	const xamu: iPluginOptions<VueComponent> = {
		routerComponent: NuxtLink,
		imageComponent: NuxtImg,
		// override defaults
		...config.xamu,
	};

	vueApp.provide("xamu", xamu);

	return { provide: { xamu } };
});
