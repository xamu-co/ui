import type { AllowedComponentProps } from "vue";

import type {
	iProperty,
	tPropertyOrderFn,
	tOrderBy,
	iNodeFn,
	iNodeStreamFn,
	tProps,
	tSizeModifier,
	iPagination,
	iPageInfo,
	tOrder,
} from "@open-xamu-co/ui-common-types";

import type { vComponent } from "../plugin";
import type { iUseThemeProps } from "./base";
import type { iModalProps } from "./modal";
import type { iValueComplexProps } from "./value";

/**
 * Table property with additional meta for internal usage
 */
export interface iTablePropertyMeta<Ti extends Record<string, any>> extends iProperty<
	Record<string, any>,
	Ti,
	vComponent<iValueComplexProps>
> {
	/** Property name */
	value: string;
	canSort: boolean;
}

export interface iTableProps<
	Ti extends Record<string, any>,
	Tm extends Record<string, any> = Ti,
> extends iUseThemeProps {
	/**
	 * Table nodes
	 * an array of nodes
	 *
	 * @old rows
	 */
	nodes: Ti[];
	/**
	 * Map nodes as required
	 * Also useful to omit nodes from the array
	 */
	mapNodes?: (nodes: NoInfer<Ti>[]) => (Tm | undefined)[];
	hydrateNodes?: (newNodes: NoInfer<Ti>[] | null, newErrors?: unknown) => void;
	/**
	 * Table column names
	 * an array of property names
	 *
	 * @old columns
	 */
	properties?: iProperty<any, NoInfer<Ti>, vComponent<iValueComplexProps>>[];
	/**
	 * Custom property order
	 */
	propertyOrder?: tPropertyOrderFn;
	/**
	 * read only table
	 * @old editable(inverse)
	 */
	readonly?: boolean;
	/**
	 * Do nodes support pagination?
	 */
	sort?: boolean | tOrderBy;
	/**
	 * Function used to update a node
	 */
	updateNode?: iNodeFn<NoInfer<Ti>> | iNodeStreamFn<NoInfer<Ti>>;
	/**
	 * Function used to delete a node
	 */
	deleteNode?: iNodeFn<NoInfer<Ti>> | iNodeStreamFn<NoInfer<Ti>>;
	/**
	 * Function used to duplicate a node
	 */
	cloneNode?: iNodeFn<NoInfer<Ti>> | iNodeStreamFn<NoInfer<Ti>>;
	/**
	 * Function used to create a node children
	 *
	 * Useful to display the add button for the default slot contents
	 */
	createNodeChildren?: iNodeFn<NoInfer<Ti>> | iNodeStreamFn<NoInfer<Ti>>;
	swal?: {
		// Update node swal texts
		updatedTitle?: string;
		updatedText?: string;
		notUpdatedTitle?: string;
		notUpdatedText?: string;
		// Clone node swal texts
		clonedTitle?: string;
		clonedText?: string;
		notClonedTitle?: string;
		notClonedText?: string;
		// Delete node swal texts
		deletedTitle?: string;
		deletedText?: string;
		notDeletedTitle?: string;
		notDeletedText?: string;
		// Create node children swal texts
		createdChildrenTitle?: string;
		createdChildrenText?: string;
		notCreatedChildrenTitle?: string;
		notCreatedChildrenText?: string;
	};
	/**
	 * Conditionally disable creating children for this particular property
	 */
	disableCreateNodeChildren?: (p: NoInfer<Ti>) => boolean;
	/**
	 * Conditionally show children for this particular property,
	 */
	showNodeChildren?: (p: NoInfer<Ti>) => boolean;
	/**
	 * Content clasess
	 */
	classes?: tProps<string>;
	/**
	 * Refresh the content
	 */
	refresh?: () => unknown;
	/**
	 * Table is nested within another
	 */
	nested?: boolean;
	/**
	 * Default children visibility
	 */
	childrenVisibility?: boolean;
	/**
	 * Human readable name
	 *
	 * @fallback property name
	 */
	childrenName?: string;
	childrenCountKey?: keyof NoInfer<Ti> | keyof NoInfer<Tm>;
	modalProps?: iModalProps & AllowedComponentProps;
	/**
	 * Prevent node functions from triggering refresh event (useful with firebase hydration)
	 */
	omitRefresh?: boolean;
	size?: tSizeModifier;
	/**
	 * Filter & order nodes through the router
	 */
	withRoute?: boolean | iPagination;
	/**
	 * Page info
	 */
	pageInfo?: iPageInfo;
	/**
	 * Show real node id or given component
	 */
	preferId?:
		| boolean
		| string
		| vComponent<{
				index: number;
				node: NoInfer<Ti>;
		  }>;
	/**
	 * Make the table container opaque
	 */
	opaque?: boolean;
}

export interface iNodeVisibility {
	disableCreateNodeChildren?: boolean;
	showNodeChildren?: boolean;
	childrenCount: number;
	// show: boolean;
}

export interface iMappedNode<Ti extends Record<string, any>, Tm extends Record<string, any> = Ti> {
	node: Tm;
	index: number;
	visibility: iNodeVisibility;
	hydrateNode: (newNode: Ti | null, _newErrors?: unknown) => void;
	createNodeChildrenAndRefresh: iNodeFn<Ti>;
}

export interface iMappedNodes<Ti extends Record<string, any>, Tm extends Record<string, any> = Ti> {
	nodes: iMappedNode<Ti, Tm>[];
	length: number;
	withChildren: boolean;
}

export interface iTableChildProps<
	Ti extends Record<string, any>,
	Tm extends Record<string, any> = Ti,
> extends iTableProps<Ti, Tm> {
	mappedNodes: iMappedNodes<Ti, Tm>;
	/**
	 * Table unique identifier
	 *
	 * Prefer a predictable identifier
	 */
	tableId: string;
	/**
	 * Node property metadata
	 *
	 * This one assumes all objects within nodes are all the same
	 */
	propertiesMeta: iTablePropertyMeta<Ti>[];
	isReadOnly: boolean;
	/** Ordering property */
	ordering: Record<string, tOrder>;
	/**
	 * Selected nodes
	 */
	selectedNodes: boolean[];
	/**
	 * Open nodes
	 * Node with children is open
	 */
	openNodes: boolean[];
	selectedNodesCount: number;
	openNodesCount: number;
	/**
	 * Can show children
	 */
	canShowChildren(visibility: iNodeVisibility, mappedIndex: number): boolean;
	/**
	 * Set pagination order
	 *
	 * @replace
	 */
	setOrdering(property: string): void;
	/**
	 * Toggle nodes selection
	 */
	toggleAll(value?: boolean, index?: number): void;
	/**
	 * Toggle nodes children visibility
	 */
	toggleChildren(index: number): void;
	/**
	 * Updates given node
	 * sometimes it could fail but still update (api issue)
	 *
	 * @single
	 */
	updateNodeAndRefresh: iNodeFn<Ti>;
	/**
	 * Clones given node
	 * sometimes it could fail but still clone (api issue)
	 *
	 * @single
	 */
	cloneNodeAndRefresh: iNodeFn<Ti, [Ti, ((m?: boolean) => any) | undefined, HTMLElement?]>;
	/**
	 * Deletes given node
	 * sometimes it could fail but still delete (api issue)
	 *
	 * @single
	 */
	deleteNodeAndRefresh: iNodeFn<Ti, [Ti, ((m?: boolean) => any) | undefined, HTMLElement?]>;
	/**
	 * Deletes multiple selected nodes
	 * sometimes it could fail but still delete (api issue)
	 *
	 * @batch
	 */
	deleteNodesAndRefresh(nodes?: Ti[]): Promise<void>;
}
