import { isRef, onActivated, onDeactivated, ref, watch, type Ref, type WatchSource } from "vue";

interface iAsyncData<T, E> {
	data: Ref<T | null>;
	pending: Ref<boolean>;
	refresh: (opts?: any) => Promise<void>;
	error: Ref<E | null>;
}

type AsyncDataOptions<T> = {
	default?: () => T | Ref<T> | null;
	transform?: (input: T) => T | Promise<T>;
	watch?: WatchSource[];
	server?: boolean;
};

type tAsyncDataHandler<T> = (nuxtApp?: any) => Promise<T>;

/**
 * Replicate nuxt sync data
 *
 * @see https://nuxt.com/docs/api/composables/use-async-data#type
 */
export function useAsyncDataFn<T, E>(
	handler: tAsyncDataHandler<T>,
	options?: AsyncDataOptions<T>
): iAsyncData<T, E>;
export function useAsyncDataFn<T, E>(
	key: string,
	handler: tAsyncDataHandler<T>,
	options?: AsyncDataOptions<T>
): iAsyncData<T, E>;
export function useAsyncDataFn<T, E>(
	handlerOrKey: string | tAsyncDataHandler<T>,
	optionsOrHandler?: tAsyncDataHandler<T> | AsyncDataOptions<T>,
	options?: AsyncDataOptions<T>
): iAsyncData<T, E> {
	const data = ref(null) as Ref<T | null>;
	const error = ref(null) as Ref<E | null>;
	/** Whether component was deactivated by keep-alive */
	const deactivated = ref(false);
	let handler: tAsyncDataHandler<T>;

	if (typeof handlerOrKey === "string") {
		if (typeof optionsOrHandler !== "object" && optionsOrHandler) handler = optionsOrHandler;
	} else {
		handler = handlerOrKey;

		if (typeof optionsOrHandler === "object") options = optionsOrHandler;
	}

	const defaultValue = options?.default?.();
	const pending = ref<boolean>(!data.value);

	if (defaultValue) {
		if (isRef(defaultValue)) data.value = defaultValue.value;
		else data.value = defaultValue;
	}

	async function refresh() {
		// prevent refresh
		if (deactivated.value) return;

		try {
			pending.value = true;
			data.value = await handler();
			error.value = null; // success, clear errors
		} catch (err) {
			data.value = null;
			error.value = err as E;
		}

		pending.value = false;
	}

	// lifecycle
	refresh(); // get first load
	watch(options?.watch || [], refresh, { immediate: false });
	onActivated(() => (deactivated.value = false));
	onDeactivated(() => (deactivated.value = true));

	return { data, error, pending, refresh };
}
