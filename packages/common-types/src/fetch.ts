export type tOrderBy = [string, ("desc" | "asc")?];

export interface iPageEdge<T, C extends string | number = string> {
	cursor: C;
	node: T;
}

export interface iPage<T, C extends string | number = string> {
	edges: iPageEdge<T, C>[];
	pageInfo: {
		nextCursor?: C;
		previousCursor?: C;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		path?: string;
	};
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
	/**
	 * JSON string
	 * aplica a cualquiera columna
	 * ej: ["id", "asc" ], order ascendente de id
	 * ej: ["id", "desc" ], order descendente de id
	 */
	orderBy?: tOrderBy;
}

/**
 * Hydrate fetch ref (no refresh)
 */
export type tHydrate<T> = (c: T, e?: unknown) => void;

export type iGetPage<T, C extends string | number = string> = (
	hydrate: tHydrate<iPage<T, C> | null>,
	params?: iPagination
) => Promise<iPage<T, C>>;
