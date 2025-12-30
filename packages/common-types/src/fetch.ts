export type tOrder = "desc" | "asc";

/**
 * Order using column or property
 *
 * @example ["id", "asc" ], order ascendente de id
 * @example ["id", "desc" ] or ["id"], order descendente de id
 */
export type tOrderBy = [string, tOrder?];

export interface iPageEdge<T, C extends string | number = string> {
	cursor: C;
	/** Node data */
	node: T;
}

export interface iPageInfo<C extends string | number = string> {
	nextCursor?: C;
	previousCursor?: C;
	/**
	 * Current page number
	 * According to the "at" and "first" parameters
	 */
	pageNumber?: number;
	/** There is a next page */
	hasNextPage: boolean;
	/** There is a previous page */
	hasPreviousPage: boolean;
	/** Current page path */
	path?: string;
}

export interface iPage<T, C extends string | number = string> {
	/**
	 * List of nodes with cursor data for the current page
	 * Amount of nodes is limited by the "first" parameter
	 */
	edges: iPageEdge<T, C>[];
	pageInfo: iPageInfo<C>;
	/**
	 * Count of nodes matching the path
	 * Independent of pagination
	 */
	totalCount: number;
}

export interface iPagination {
	/**
	 * Identificador del elemento donde empieza la paginacion
	 *
	 * starts at 0
	 */
	at?: string | number;
	/**
	 * Cantidad de elementos por pagina (limite)
	 */
	first?: number;
	/**
	 * Order using column or property
	 *
	 * @example [["id", "asc" ]], order ascendente de id
	 * @example [["id", "desc" ]] or [["id"]], order descendente de id
	 */
	orderBy?: tOrderBy[];
}

export type iGetPage<T, C extends string | number = string> = (
	params?: iPagination
) => Promise<iPage<T, C> | undefined>;
