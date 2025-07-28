export interface iSelectOption {
	value: string | number;
	alias?: string;
	selected?: boolean;
	disabled?: boolean;
	hidden?: boolean;
}

/**
 * Response from node functions
 *
 * Action result, event and callback
 */
export type iNodeFnResponse<T extends Record<string, any> = never> = [
	(boolean | T)?,
	Event?,
	(() => void)?,
];

/**
 * Funtions that uses a node and perform some action
 *
 * Useful for table actions like creating, updating and deleting nodes
 *
 * Undefined would mean no action was performed
 * True or an T type object would mean action was performed successfully
 * False would mean action failed
 */
export type iNodeFn<T extends Record<string, any>, Ta extends [T?, ...any[]] = [T]> = (
	...args: Ta
) => boolean | undefined | iNodeFnResponse<T> | Promise<boolean | undefined | iNodeFnResponse<T>>;

/**
 * Used on Table and related components
 *
 * @action Any task performed at each row cell (property)
 * @nested Any task performed at a relation table within a modal
 */
export interface iProperty<
	T extends Record<string, any> = Record<string, any>,
	P extends Record<string, any> = Record<string, any>,
	ComponentType = unknown,
> extends iSelectOption {
	/**
	 * Function to create a node within the relation
	 * The parent is given since the node doesn't exist yet
	 *
	 * @action Showcases an button to create a new node/value within this property/relation
	 * @nested Passed down to the related table if any
	 */
	createNode?: iNodeFn<P, [P?]>;
	/**
	 * Conditionally disable creating children for this particular property
	 */
	disableCreateNode?: (p: P) => boolean;
	/**
	 * Function to clone a node within the relation
	 * Set to false to omit cloning this property/relation
	 *
	 * @action No inline action
	 * @nested Passed down to the related table if any
	 */
	cloneNode?: iNodeFn<T, [T?]> | false;
	/**
	 * Function to update a node within the relation
	 *
	 * @action Showcases an button to update this node/value within this property/relation
	 * @nested Passed down to the related table if any
	 */
	updateNode?: iNodeFn<T, [T?, P?]>;
	/**
	 * Function to delete a node within the relation
	 *
	 * @action No inline action
	 * @nested Passed down to the related table if any
	 */
	deleteNode?: iNodeFn<T, [T?]>;
	/**
	 * Render row cell (property) using this component instead
	 */
	component?: ComponentType;
	/**
	 * Url to an image to be used as placeholder for images that failed to load
	 * Overrides the plugin's imagePlaceholder
	 */
	imagePlaceholder?: string;
}

export type tPropertyOrderFn = (a: [string, any], b: [string, any]) => -1 | 0 | 1;
