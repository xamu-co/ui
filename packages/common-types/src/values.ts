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
export type iNodeFn<T extends Record<string, any>, Ta extends [T?] = [T]> = (
	...args: Ta
) => boolean | undefined | Promise<boolean | undefined>;

/**
 * used on FactoryTable and related components
 */
export interface iProperty<T extends Record<string, any> = Record<string, any>>
	extends iSelectOption {
	/**
	 * Function to create a node within the relation
	 */
	createNode?: iNodeFn<T, [T?]>;
	/**
	 * Function to clone a node within the relation
	 */
	cloneNode?: iNodeFn<T, [T?]>;
	/**
	 * Function to update a node within the relation
	 */
	updateNode?: iNodeFn<T, [T?]>;
	/**
	 * Function to delete a node within the relation
	 */
	deleteNode?: iNodeFn<T, [T?]>;
}
