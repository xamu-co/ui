export interface iSelectOption {
	value: string | number;
	alias?: string;
	selected?: boolean;
}

/**
 * Funtions that uses a node and perform some action
 *
 * Useful for table actions like creating, updating and deleting nodes
 */
export type iNodeFn<T extends Record<string, any>> = (
	n: T
) => boolean | undefined | Promise<boolean | undefined>;

/**
 * used on FactoryTable and related components
 */
export interface iProperty<T extends Record<string, any> = Record<string, any>>
	extends iSelectOption {
	/**
	 * Function to create a node within the relation
	 */
	createNode?: (n?: T) => boolean | undefined | Promise<boolean | undefined>;
}
