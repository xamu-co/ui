import type { Ref } from "vue";

import type {
	iPagination,
	iGetPage,
	iPage,
	iNodeStreamFn,
	iNodeFn,
	tProp,
	tThemeModifier,
	tThemeTuple,
} from "@open-xamu-co/ui-common-types";

import type { vComponent } from "../plugin";
import type { iUseThemeProps } from "./base";
import type { iTableProps } from "./table";

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
	promise?: false | ((...args: [...Pi, AbortSignal | undefined]) => Promise<Ti>);
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
		| ((
				content: Ref<Ti | null>,
				errors: Ref<unknown>
		  ) => (...args: [...Pi, AbortSignal | undefined]) => Promise<Ti>);
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
	/**
	 * Whether to cache data
	 *
	 * @default true
	 */
	cache?: boolean;
}

export interface iPaginationContentProps<Ti, Ci extends string | number = string, Ri = never>
	extends iPagination, iUseThemeProps {
	/**
	 * Function used to fetch the page
	 */
	page?: Ri extends iGetPage<Ti, Ci>
		? iGetPage<Ti, Ci>
		: (params?: iPagination, signal?: AbortSignal) => Promise<Ri | undefined>;
	/**
	 * Function used to fetch the page and hydrate the content
	 */
	hydratablePage?: (
		content: Ref<iPage<Ti, Ci> | null | undefined>,
		errors: Ref<unknown>
	) => Ri extends iGetPage<Ti, Ci>
		? iGetPage<Ti, Ci>
		: (params?: iPagination, signal?: AbortSignal) => Promise<Ri | undefined>;
	/**
	 * Path used as key for the cache
	 */
	url?: string;
	/**
	 * paginate using route
	 *
	 * @example "?orderBy=id:asc" single order property
	 * @example "?orderBy=id:asc&orderBy=createdAt" multiple order properties
	 */
	withRoute?: boolean;
	/**
	 * hide pagination buttons
	 *
	 * @example true hide pagination buttons
	 * @example "single" hide pagination buttons if only one page
	 */
	hideControls?: boolean | "single";
	preventAutoload?: boolean;
	/**
	 * Additional parameters to send every request
	 */
	defaults?: Record<string, any>;
	noContentMessage?: string;
	/**
	 * Loader label
	 */
	label?: string;
	/**
	 * When additional operations are required on fetched data
	 *
	 * Raw promise payload
	 */
	transform?: (r: Ri) => iPage<Ti, Ci> | undefined;
	/**
	 * When additional operations are required on content
	 *
	 * Nodes arr only
	 */
	processContent?: (n: NoInfer<Ti>[]) => NoInfer<Ti>[];
	/**
	 * Ignore errors and display existing content.
	 */
	ignoreErrors?: boolean;
	/**
	 * Whether to fetch data on client side only
	 */
	client?: boolean;
	/**
	 * Whether to cache data
	 *
	 * @default true
	 */
	cache?: boolean;
	/**
	 * Additional class for the pagination
	 *
	 * @example --txtColor
	 */
	paginationClass?: string | string[] | Record<string, boolean>;
}

export interface iPaginationContentTableProps<
	Ti extends Record<string, any>,
	TMi extends Record<string, any>,
> {
	/**
	 * Required to dedupe caching
	 */
	url: string;
	page: iGetPage<Ti, any>;
	defaults?: Record<string, any>;
	/** Map node data as required */
	mapNode?: (node: Ti) => TMi;
	preventAutoload?: boolean;
	/**
	 * Additional refresh function
	 */
	refresh?: () => void;
	noContentMessage?: string;
	renderErrorMessage?: string;
	tableProps?: Omit<iTableProps<Ti, TMi>, "nodes" | "refresh">;
	theme?: tThemeTuple | tProp<tThemeModifier>;
	/**
	 * Whether to fetch data on client side only
	 */
	client?: boolean;
	/**
	 * Whether to cache data
	 *
	 * @default true
	 */
	cache?: boolean;
	/**
	 * Additional class for the table
	 *
	 * @example --txtColor
	 */
	tableClass?: string | string[] | Record<string, boolean>;
	/**
	 * Additional class for the modal
	 *
	 * @example --txtColor
	 */
	modalClass?: string | string[] | Record<string, boolean>;
	/** Function used to create a node */
	createNode?: iNodeStreamFn<NoInfer<Ti>, []> | iNodeFn<NoInfer<Ti>, []>;
	swal?: {
		// Create node swal texts
		createdTitle?: string;
		createdText?: string;
		notCreatedTitle?: string;
		notCreatedText?: string;
	};
	/**
	 * Prevent node functions from triggering refresh event (useful with firebase hydration)
	 */
	omitRefresh?: boolean;
	/**
	 * Paginate using route
	 * @default true
	 */
	withRoute?: boolean;
}
