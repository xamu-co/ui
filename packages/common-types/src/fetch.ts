export type tOrder = "desc" | "asc";

/**
 * Order using column or property
 *
 * @example [["id", "asc" ]], order ascendente de id
 * @example [["id", "desc" ]] or [["id"]], order descendente de id
 */
export type tOrderBy = [string, tOrder?];

export interface iPageEdge<T, C extends string | number = string> {
	cursor: C;
	node: T;
}

export interface iPageInfo<C extends string | number = string> {
	nextCursor?: C;
	previousCursor?: C;
	pageNumber?: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	path?: string;
}

export interface iPage<T, C extends string | number = string> {
	edges: iPageEdge<T, C>[];
	pageInfo: iPageInfo<C>;
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
	 * Cantidad de elementos (limite)
	 */
	first?: number;
	orderBy?: tOrderBy[];
}

export type iGetPage<T, C extends string | number = string> = (
	params?: iPagination
) => Promise<iPage<T, C> | undefined>;
