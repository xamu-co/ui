<template>
	<BaseErrorBoundary at="ContentFetch" :theme="theme">
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
	import { ref, watch, computed, onActivated, onDeactivated } from "vue";
	import isEqual from "lodash-es/isEqual";

	import BaseErrorBoundary from "../base/ErrorBoundary.vue";
	import LoaderContent from "./Content.vue";

	import type { iLoaderContentFetchProps } from "../../types/props";
	import useAsyncDataFn from "../../composables/async";
	import useFetchUtils from "../../composables/fetch";

	/**
	 * Content loader with data fetching
	 *
	 * Resolves a promise and display or hide content while it is loading
	 *
	 * @component
	 * @example Because of await, suspense is required
	 * <suspense>
	 * 	<LoaderContentFetch :promise="fetchData" />
	 * 	<template #fallback>
	 * 		<Loader />
	 * 	</template>
	 * </suspense>
	 */

	defineOptions({ name: "LoaderContentFetch", inheritAttrs: false });

	const props = withDefaults(defineProps<iLoaderContentFetchProps<T, P>>(), {
		cache: true,
	});
	const emit = defineEmits(["refresh", "has-content", "hydrate"]);

	const { useFetch } = useFetchUtils();

	let useAsyncDataLocal: typeof useAsyncDataFn;

	try {
		// @ts-expect-error useAsyncData is only available in nuxt context
		useAsyncDataLocal = useAsyncData;
	} catch (err) {
		useAsyncDataLocal = useAsyncDataFn;
	}

	const firstLoad = ref(false);
	/** Whether component was deactivated by keep-alive */
	const deactivated = ref(false);

	/**
	 * Use Nuxt useAsyncData to fetch data
	 * We wrap the results to avoid non cacheable null responses
	 * Await to trigger SSR in nuxt contexts
	 */
	const {
		data,
		pending: loading,
		error: errors,
		refresh,
	} = await useAsyncDataLocal(
		props.url || "",
		async (_, { signal } = {}): Promise<{ data: T | null }> => {
			let newData: T | null = null;

			if (!props.promise && !props.hydratablePromise && !props.url) return { data: null };

			if (props.preventAutoload) {
				// Is promise like
				const pl = props.promise !== undefined || props.hydratablePromise !== undefined;

				// Prevent on first load or if url is used as key
				if (!firstLoad.value || (!!props.url && pl)) return { data: null };
			}

			const payload = <P>(props.payload || []);

			if (props.promise) {
				newData = await props.promise(...payload, signal);
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

				newData = await props.hydratablePromise(hydrateContent, hydrateErrors)(
					...payload,
					signal
				);
			} else if (props.url) {
				const response = await useFetch<any>(props.url, ...payload);
				const data = "data" in response ? response.data : response;

				if (response.error) throw new Error(response.error);
				if (data) newData = data;
			}

			firstLoad.value = true;

			return { data: newData ?? props.fallback ?? null };
		},
		{
			default: () => ({ data: props.fallback ?? null }),
			watch: [() => props.url, () => props.preventAutoload],
			server: !props.client,
			getCachedData: props.cache ? undefined : () => null,
		}
	);

	/** Unwrap the results */
	const content = computed<T | null>({
		get: () => data.value?.data ?? null,
		set: (val: T | null) => {
			data.value = { data: val };
		},
	});

	/**
	 * Whether content was hydrated
	 * By default, if firstLoad is not set but there is content, it means it was hydrated
	 */
	const hydrated = ref<boolean>(!props.fallback && !!content.value);

	function hydrate(newContent: T | null, newErrors?: unknown) {
		if (deactivated.value) return;
		// Wait for first load if preventAutoload is set
		if (props.preventAutoload && !firstLoad.value) return;

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
			// Wait for first load if preventAutoload is set
			if (props.preventAutoload && !firstLoad.value) return;
			// Refresh if payload changes
			if (!isEqual(newPayload, oldPayload)) refresh();
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
