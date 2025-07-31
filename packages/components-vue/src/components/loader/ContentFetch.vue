<template>
	<BaseErrorBoundary :theme="theme">
		<LoaderContent
			v-bind="{
				content: patchedIsContent(content),
				errors,
				loading,
				refresh,
				unwrap,
				theme,
				noContentMessage,
				label,
				noLoader,
				ignoreErrors,
				el: loaderEl,
			}"
			:class="$attrs.class"
		>
			<slot
				v-if="patchedIsContent(content)"
				v-bind="{ content, refresh, loading, errors, hydrate }"
			></slot>
		</LoaderContent>
	</BaseErrorBoundary>
</template>

<script setup lang="ts" generic="T, P extends any[] = any[]">
	import { ref, watch, type Ref, computed, onActivated, onDeactivated, inject } from "vue";
	import isEqual from "lodash-es/isEqual";

	import { useUtils } from "@open-xamu-co/ui-common-helpers";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import LoaderContent from "./Content.vue";

	import type { vComponent } from "../../types/plugin";
	import type { iUseThemeProps } from "../../types/props";
	import type { iVuePluginOptions } from "../../types/plugin";
	import { useAsyncDataFn } from "../../composables/async";
	import { useHelpers } from "../../composables/utils";
	import useFetchUtils from "../../composables/fetch";

	export interface iLoaderContentFetchProps<Ti, Pi extends any[]> extends iUseThemeProps {
		noContentMessage?: string;
		/** Loader label */
		label?: string;
		/** Hide loader */
		noLoader?: boolean;
		fallback?: NoInfer<Ti>;
		/** Remove loader wrapper element */
		unwrap?: boolean;
		/**
		 * URL to fetch from
		 *
		 * Used as key if promise or hydratablePromise are provided.
		 * Make sure to use preventAutoload to avoid invalid fetching.
		 */
		url?: false | string;
		promise?: false | ((...args: Pi) => Promise<Ti>);
		/**
		 * Hydrate values after promise if resolved
		 * Useful with firebase
		 *
		 * @see https://firebase.google.com/docs/database/
		 *
		 * Hydration is conditioned to the context (disabled, loading...)
		 */
		hydratablePromise?:
			| false
			| ((content: Ref<Ti | null>, errors: Ref<unknown>) => (...args: Pi) => Promise<Ti>);
		payload?: Pi;
		/**
		 * Component or tag to render on loader
		 */
		loaderEl?: vComponent | string;
		preventAutoload?: boolean;
		/** Additional content validation before rendering fetched data */
		isContent?: (c?: NoInfer<Ti>) => boolean;
		/** Ignore errors and display existing content */
		ignoreErrors?: boolean;
		/**
		 * Whether to fetch data on client side only
		 */
		client?: boolean;
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
	const emit = defineEmits(["refresh", "has-content", "hydrate"]);

	const { logger } = useHelpers(useUtils);
	const { useFetch } = useFetchUtils();
	const { internals } = inject<iVuePluginOptions>("xamu") || {};
	const useAsyncData: typeof useAsyncDataFn = internals?.useAsyncData ?? useAsyncDataFn;

	const firstLoad = ref(false);
	/** Whether component was deactivated by keep-alive */
	const deactivated = ref(false);

	const {
		data: content,
		pending: loading,
		error: errors,
		refresh,
	} = useAsyncData(
		props.url || "",
		async (): Promise<T | null> => {
			let newData: T | null = null;

			try {
				if (!props.promise && !props.hydratablePromise && !props.url) return null;
				if (props.preventAutoload) {
					// is promise like
					const pl = props.promise !== undefined || props.hydratablePromise !== undefined;

					// Prevent on first load or if url is used as key
					if (!firstLoad.value || (!!props.url && pl)) return null;
				}
				if (props.promise || props.hydratablePromise) {
					const payload = <P>(props.payload || []);

					if (props.promise) {
						newData = await props.promise(...payload);
					} else if (props.hydratablePromise) {
						/**
						 * Hydrate content
						 * Returns the actual content & allows for hydration
						 */
						const hydrateContent = computed({
							get: () => content.value ?? null,
							set: (newContent) => hydrate(newContent ?? null, errors.value),
						});
						/**
						 * Hydrate errors
						 * Returns the actual errors & allows for hydration
						 */
						const hydrateErrors = computed({
							get: () => errors.value ?? null,
							set: (newErrors) => hydrate(content.value ?? null, newErrors),
						});

						newData = await props.hydratablePromise(
							hydrateContent,
							hydrateErrors
						)(...payload);
					}
				} else if (props.url) {
					const response = await useFetch<any>(props.url);
					const data = "data" in response ? response.data : response;

					if (response.error) throw new Error(response.error);
					if (data) newData = data;
				}
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "unknown error";

				logger("LoaderContentFetch:useAsyncData", errorMessage, err);

				throw err; // throw error anyway, asyncData will intercept it
			}

			firstLoad.value = true;

			return newData ?? props.fallback ?? null;
		},
		{
			default: () => props.fallback,
			watch: [() => props.url, () => props.preventAutoload],
			server: !props.client,
		}
	);

	/**
	 * Whether content was hydrated
	 * By default, if firstLoad is not set but there is content, it means it was hydrated
	 */
	const hydrated = ref<boolean>(!props.fallback && !!content.value);

	function hydrate(newContent: T | null, newErrors?: unknown) {
		if (deactivated.value) return;
		if (!props.preventAutoload && !firstLoad.value) return;

		hydrated.value = true;
		content.value = newContent;
		errors.value = newErrors;
	}

	function patchedIsContent(c?: T | null): c is NonNullable<T> {
		// isContent needs to run always
		const isValid = props.isContent?.(c ?? undefined) ?? !!c;
		const wasFetched = firstLoad.value || !!props.fallback || hydrated.value;
		const isContent = isValid && wasFetched;

		return isContent;
	}
	function validatePromiseLike(newPromise: any, oldPromise: any) {
		/**
		 * The same promise would trigger the watcher
		 * We assume here that the same promise is provided
		 */
		const possibleSamePromise = !!newPromise && !!oldPromise;

		// prevent multiple requests
		if (newPromise === oldPromise || !!possibleSamePromise) return;

		// refresh
		if (!loading.value && !!newPromise) refresh();
	}

	// lifecycle
	emit("refresh", refresh); // Allow the parent to manually force an update
	emit("hydrate", hydrate); // Allow the parent to hydrate the content
	// refetch on url or promise change
	watch(() => props.promise, validatePromiseLike, { immediate: false });
	watch(() => props.hydratablePromise, validatePromiseLike, { immediate: false });
	watch(
		() => props.payload,
		(newPayload, oldPayload) => {
			// Refresh if payload changes
			if (firstLoad.value && !isEqual(newPayload, oldPayload)) refresh();
		},
		{ immediate: false }
	);
	watch(
		content,
		(newContent) => {
			const isContent = patchedIsContent(newContent);

			emit("has-content", isContent, newContent, hydrate);
		},
		{ immediate: true }
	);
	onActivated(() => (deactivated.value = false));
	onDeactivated(() => (deactivated.value = true));
</script>
