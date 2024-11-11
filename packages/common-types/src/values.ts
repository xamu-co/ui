export interface iSelectOption {
	value: string | number;
	alias?: string;
	selected?: boolean;
	disabled?: boolean;
}

export type iNodeFnResponse = [boolean?, Event?, (() => void)?];

/**
 * Funtions that uses a node and perform some action
 *
 * Useful for table actions like creating, updating and deleting nodes
 */
export type iNodeFn<T extends Record<string, any>, Ta extends [T?, ...any[]] = [T]> = (
	...args: Ta
) => boolean | undefined | iNodeFnResponse | Promise<boolean | undefined | iNodeFnResponse>;

/**
 * used on FactoryTable and related components
 */
export interface iProperty<
	T extends Record<string, any> = Record<string, any>,
	P extends Record<string, any> = Record<string, any>,
	ComponentType = unknown,
> extends iSelectOption {
	/**
	 * Function to create a node within the relation
	 * The parent is given since the node doesn't exist yet
	 */
	createNode?: iNodeFn<P, [P?]>;
	/**
	 * Conditionally disable creating children for this particular property
	 */
	disableCreateNode?: (p: P) => boolean;
	/**
	 * Function to clone a node within the relation
	 */
	cloneNode?: iNodeFn<T, [T?]>;
	/**
	 * Function to update a node within the relation
	 */
	updateNode?: iNodeFn<T, [T?, P?]>;
	/**
	 * Function to delete a node within the relation
	 */
	deleteNode?: iNodeFn<T, [T?]>;
	/**
	 * Render using this component instead
	 */
	component?: ComponentType;
}

export type tPropertyOrderFn = (a: [string, any], b: [string, any]) => -1 | 0 | 1;
