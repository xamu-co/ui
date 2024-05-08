<template>
	<BaseErrorBoundary :theme="theme">
		<LoaderContent
			v-bind="{
				...$attrs,
				content: !!content,
				errors: !!errors,
				loading: loading,
				refresh,
				unwrap,
				theme,
				label,
				noLoader,
			}"
		>
			<slot
				v-if="content && (!loading || firstLoad)"
				v-bind="{ content, refresh, loading, errors }"
			></slot>
		</LoaderContent>
	</BaseErrorBoundary>
</template>

<script setup lang="ts" generic="T, P extends any[] = any[]">
	import {
		ref,
		watch,
		type Component as VueComponent,
		type FunctionalComponent,
		type DefineComponent,
		computed,
	} from "vue";
	import _ from "lodash";

	import type { tHydrate } from "@open-xamu-co/ui-common-types";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import LoaderContent from "./Content.vue";

	import type { iUseThemeProps } from "../../types/props";

	type tDataPromise<Ti, Pi extends any[]> = (...args: Pi) => Promise<Ti>;

	interface iLoaderContentFetchProps<Ti, Pi extends any[]> extends iUseThemeProps {
		/**
		 * Loader label
		 */
		label?: string;
		/**
		 * Hide loader
		 */
		noLoader?: boolean;
		fallback?: Ti;
		unwrap?: boolean;
		url?: false | string;
		promise?: false | tDataPromise<Ti, Pi>;
		hydratablePromise?: false | ((hydrate: tHydrate<Ti>) => tDataPromise<Ti, Pi>);
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
	const fetchedContent = ref<T>();
	const firstLoad = ref(false);
	const hydrated = ref(false);
	/**
	 * Hydrate content
	 *
	 * Useful with firebase client approach
	 */
	const hydrate: tHydrate<T> = (newContent, newErrors) => {
		// prevent hydration
		if (fetchedContent.value && !hydrated.value) return (hydrated.value = true);
		if (!props.preventAutoload && !firstLoad.value) return;

		fetchedContent.value = newContent;
		errors.value = newErrors;
	};
	const content = computed(() => fetchedContent.value ?? props.fallback);

	async function refresh() {
		try {
			if (props.promise || props.hydratablePromise || props.url) {
				loading.value = true;

				// use fallback while the real content loads
				if (props.fallback) firstLoad.value = true;

				if (props.promise || props.hydratablePromise) {
					const payload = <P>(props.payload || []);

					if (props.promise) {
						fetchedContent.value = await props.promise(...payload);
					} else if (props.hydratablePromise) {
						fetchedContent.value = await props.hydratablePromise(hydrate)(...payload);
					}
				} else if (props.url) {
					const response = await (await fetch(props.url)).json();
					const data = "data" in response ? response.data : response;

					if (response.error) throw new Error(response.error);
					if (data) fetchedContent.value = data;
				}

				// success, clear errors
				errors.value = undefined;
			} else console.warn("No data source url or promise provided");
		} catch (err) {
			console.error(err);
			fetchedContent.value = undefined;
			errors.value = err;
		}

		firstLoad.value = true;
		loading.value = false;
	}

	// lifecycle
	if (!props.preventAutoload) refresh();

	// Allow the parent to manually force an update
	emit("refresh", refresh);

	// refetch on url or promise change
	watch(
		() => props.url,
		(newUrl, oldUrl) => {
			// prevent muntiple requests
			if (newUrl === oldUrl) return;

			// refresh
			if (!loading.value && !!newUrl) refresh();
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
