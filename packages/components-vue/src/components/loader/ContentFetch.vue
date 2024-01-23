<template>
	<LoaderContent
		v-bind="{
			...$attrs,
			content: !!content,
			errors: !!errors,
			loading,
			refresh,
			unwrap,
			theme,
		}"
	>
		<slot v-if="content" v-bind="{ content, refresh, loading, errors }"></slot>
	</LoaderContent>
</template>

<script setup lang="ts" generic="T, P extends unknown[] = unknown[]">
	import {
		ref,
		watch,
		type Component as VueComponent,
		type FunctionalComponent,
		type DefineComponent,
	} from "vue";
	import _ from "lodash";

	import type { tHydrate } from "@open-xamu-co/ui-common-types";

	import LoaderContent from "./Content.vue";

	import type { iUseThemeProps } from "../../types/props";

	export interface iLoaderContentFetchProps<Ti, Pi extends unknown[]> extends iUseThemeProps {
		promise?: false | ((hydrate: tHydrate<Ti>, ...args: Pi) => Promise<Ti>);
		url?: false | string;
		fallback?: Ti;
		unwrap?: boolean;
		payload?: Pi;
		/**
		 * Component or tag to render
		 */
		el?: VueComponent | FunctionalComponent | DefineComponent | string;
		preventAutoload?: boolean;
	}

	/**
	 * Content loader with data fetching
	 *
	 * Resolves a promise and display or hide content while it is loading
	 *
	 * @component
	 * @example
	 * <LoaderContentFetch></LoaderContentFetch>
	 */

	defineOptions({ name: "LoaderContentFetch", inheritAttrs: false });

	const props = defineProps<iLoaderContentFetchProps<T, P>>();
	const emit = defineEmits(["refresh"]);

	const loading = ref(false);
	const errors = ref();
	const content = ref<T>();
	const firstLoad = ref(false);
	const hydrated = ref(false);
	const hydrate: tHydrate<T> = (newContent, newErrors) => {
		// prevent hydration
		if (content.value && !hydrated.value) return (hydrated.value = true);
		if (!props.preventAutoload && !firstLoad.value) return;

		content.value = newContent;
		errors.value = newErrors;
	};

	async function refresh(fallback?: T) {
		if (fallback) content.value = fallback;
		if (!(props.promise || props.url)) return;

		try {
			loading.value = true;

			if (props.promise) {
				content.value = await props.promise(hydrate, ...(<P>(props.payload || [])));
			} else if (props.url) {
				const response = await (await fetch(props.url)).json();
				const data = "data" in response ? response.data : response;

				if (response.error) throw new Error(response.error);
				if (data) content.value = data;
			}

			// success, clear errors
			errors.value = undefined;
		} catch (err) {
			console.error(err);
			content.value = undefined;
			errors.value = err;
		}

		firstLoad.value = true;
		loading.value = false;
		// Allow the parent to manually force an update
		emit("refresh", refresh);
	}

	// lifecycle
	if (!props.preventAutoload) refresh(props.fallback);

	// refetch on url or promise change
	watch(
		() => props.url,
		(newUrl, oldUrl) => {
			// prevent muntiple requests
			if (newUrl === oldUrl) return;

			// refresh
			if (!loading.value && !!newUrl) refresh();
			else if (props.fallback) content.value = props.fallback;
		},
		{ immediate: false }
	);
	watch(
		() => props.promise,
		(newPromise, oldPromise) => {
			/**
			 * The same promise would trigger the watcher
			 * We assume here that the same promise is provided
			 */
			const possibleSamePromise = !!newPromise && !!oldPromise;

			// prevent muntiple requests
			if (newPromise === oldPromise || !!possibleSamePromise) return;

			// refresh
			if (!loading.value && !!newPromise) refresh();
			else if (props.fallback) content.value = props.fallback;
		},
		{ immediate: false }
	);
	// load if the firstLoad was prevented
	watch(
		() => props.preventAutoload,
		(prevent) => {
			if (!prevent && !firstLoad.value) refresh();
		},
		{ immediate: false }
	);
	// Refresh if payload changes
	watch(
		() => props.payload,
		(newPayload, oldPayload) => {
			if (firstLoad.value && !_.isEqual(newPayload, oldPayload)) refresh();
		},
		{ immediate: false }
	);
</script>
