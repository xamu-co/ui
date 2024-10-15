import type { Component as VueComponent, DefineComponent, FunctionalComponent } from "vue";
import type { iPluginOptions } from "@open-xamu-co/ui-common-types";

import type { useAsyncDataFn } from "../composables/async";

export interface iVuePluginOptions
	extends iPluginOptions<VueComponent | FunctionalComponent | DefineComponent> {
	asyncDataFn?: typeof useAsyncDataFn;
}
