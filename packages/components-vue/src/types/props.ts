import type {
	iFormOption,
	tFormAutocomplete,
	tIndicative,
	tProp,
	tProps,
	tPropsModifier,
	tThemeModifier,
	tThemeTuple,
	tSizeModifier,
	iProperty,
	iNodeFn,
	tOrderBy,
	tPropertyOrderFn,
	tOrder,
} from "@open-xamu-co/ui-common-types";
import type { AllowedComponentProps, RendererElement } from "vue";
import type { vComponent } from "./plugin";

export interface iUseModifiersProps {
	hidden?: string | tPropsModifier<string>;
	size?: tSizeModifier | number;
}

export interface iUseStateProps {
	/**
	 * Alert state: Mostly useful on actions
	 * Included here to make his usage less verbose
	 *
	 * @state
	 * @example is--alert
	 */
	alert?: boolean;
	/**
	 * Active state: Mostly useful on actions
	 * Included here to make his usage less verbose
	 *
	 * @state
	 * @example is--active
	 */
	active?: boolean;
	/**
	 * Invalid state: Mostly useful on inputs
	 * Included here to make his usage less verbose
	 *
	 * @state
	 * @example is--invalid
	 */
	invalid?: boolean;
	/**
	 * prevent theme overrides
	 *
	 * @state
	 * @example no--overrides
	 */
	noOverrides?: boolean;
	/**
	 * Component states
	 *
	 * @example invalid, active, alert
	 */
	state?: Record<string, boolean>;
}

export interface iUseThemeProps {
	theme?: tThemeTuple | tProp<tThemeModifier>;
	/** invert given theme */
	invertTheme?: boolean;
	/**
	 * apply shadow if given theme or themes are active
	 */
	shadow?: boolean | tThemeModifier[];
}

export interface iUseThemeTooltipProps {
	/**
	 * Show given text as tooltip on hover.
	 *
	 * Includes aria-label tag automatically
	 */
	tooltip?: tProp;
	tooltipPosition?: "right" | "left" | "bottom" | "top";
	tooltipAsText?: boolean;
}

export interface iActionProps {
	to?: string | Record<string, unknown>;
	href?: string;
	target?: string;
	tel?: string;
	disabled?: boolean;
	mailto?: string;
	type?: "button" | "submit" | "reset";
	tag?: string;
	toggle?: tProp<"dropdown" | "list">;
	round?: string | tPropsModifier<string>;
	toggleState?: tProps<string>;
	indicative?: tIndicative;
	whatsapp?: boolean | string;
	download?: string;
	tabindex?: string;
}

interface iInputLikeProps {
	id?: string;
	name?: string;
	placeholder?: string;
	title?: string;
	required?: boolean;
	disabled?: boolean;
	tabindex?: string;
}

export interface iInputProps extends iInputLikeProps {
	/**
	 * Input type
	 * TODO?: limit types
	 */
	type?: string;
	autocomplete?: tFormAutocomplete;
}

export interface iSelectProps extends iInputLikeProps {
	options?: Array<string | number | iFormOption>;
	/**
	 * Multiple fields
	 */
	multiple?: boolean;
}

export interface iModalButtonConfig {
	title?: string;
	visible?: boolean;
	btnClass?: string;
}

export interface iModalProps extends iUseThemeProps {
	/**
	 * Modal is loading
	 * Some of the modal contents could be still loading
	 */
	loading?: boolean;
	/**
	 * The title of the modal shown in .x-modal-header div. If empty title is not rendered
	 */
	title?: string;
	subtitle?: string;
	/**
	 * :class object which is attached to the modal modal element
	 */
	modalClass?: string | string[] | Record<string, boolean>;
	/**
	 * :class object which is attached to the modal modal content element
	 *
	 * Useless if content slot is used
	 */
	modalContentClass?: string | string[] | Record<string, boolean>;
	/**
	 * Save button config
	 */
	saveButton?: iModalButtonConfig & { disabled?: boolean };
	/**
	 * Cancel button config
	 */
	cancelButton?: iModalButtonConfig;
	/**
	 * Are modal requirement meet?
	 * This is intended to prevent the usage of certain modals
	 *
	 * Ex: user does not have enough permissions
	 */
	hide?: boolean;
	hideMessage?: string;
	hideFooter?: boolean;
	/**
	 * disables modal
	 */
	disabled?: boolean;
	// PRIVATE
	/**
	 * Shows/hides the modal
	 * @private
	 */
	modelValue?: boolean;
	target?: string | RendererElement;
}

export interface iValueComplexProps extends iUseThemeProps {
	/**
	 * Cell value
	 */
	value: any;
	/**
	 * Cell column property
	 */
	property?: iProperty<any, any>;
	/**
	 * Cell node, aka parent node
	 *
	 * The value prop will be a property of this node
	 */
	node?: Record<string, any>;
	readonly?: boolean;
	classes?: tProps<string>;
	/**
	 * Refresh the content
	 */
	refresh?: () => unknown;
	modalProps?: iModalProps & AllowedComponentProps;
	/**
	 * Prevent node functions from triggering refresh event (useful with firebase hydration)
	 */
	omitRefresh?: boolean;
	verbose?: boolean;
	size?: tSizeModifier;
}

/**
 * Table property with additional meta for internal usage
 */
export interface iTablePropertyMeta<Ti extends Record<string, any>>
	extends iProperty<Record<string, any>, Ti, vComponent<iValueComplexProps>> {
	value: string;
	canSort: boolean;
}

export interface iTableProps<Ti extends Record<string, any>> extends iUseThemeProps {
	/**
	 * Table nodes
	 * an array of nodes
	 *
	 * @old rows
	 */
	nodes: Ti[];
	/**
	 * Table column names
	 * an array of property names
	 *
	 * @old columns
	 */
	properties?: iProperty<any, NoInfer<Ti>, vComponent<iValueComplexProps>>[];
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
	updateNode?: iNodeFn<NoInfer<Ti>>;
	/**
	 * Function used to delete a node
	 */
	deleteNode?: iNodeFn<NoInfer<Ti>>;
	/**
	 * Function used to duplicate a node
	 */
	cloneNode?: iNodeFn<NoInfer<Ti>>;
	/**
	 * Function used to create a node children
	 *
	 * Useful to display the add button for the default slot contents
	 */
	createNodeChildren?: iNodeFn<NoInfer<Ti>>;
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
	childrenCountKey?: keyof NoInfer<Ti>;
	modalProps?: iModalProps & AllowedComponentProps;
	/**
	 * Prevent node functions from triggering refresh event (useful with firebase hydration)
	 */
	omitRefresh?: boolean;
	size?: tSizeModifier;
	withRoute?: boolean;
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
}

export interface iTableChildProps<Ti extends Record<string, any>> extends iTableProps<Ti> {
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
	 * Visible and selected nodes
	 *
	 * [selected, show]
	 */
	selectedNodes: [boolean, boolean][];
	selectedNodesCount: number;
	openNodesCount: number;
	/**
	 * Count childrens
	 *
	 * node['propertyWithChildren']
	 */
	childrenCount(node: Ti): number;
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
	updateNodeAndRefresh(node: Ti): Promise<void>;
	/**
	 * Clones given node
	 * sometimes it could fail but still clone (api issue)
	 *
	 * @single
	 */
	cloneNodeAndRefresh(node: Ti, toggleModal?: (m?: boolean) => any): Promise<void>;
	/**
	 * Deletes given node
	 * sometimes it could fail but still delete (api issue)
	 *
	 * @single
	 */
	deleteNodeAndRefresh(
		node: Ti,
		toggleModal?: (m?: boolean) => any,
		modalRef?: HTMLElement
	): Promise<void>;
	/**
	 * Deletes multiple selected nodes
	 * sometimes it could fail but still delete (api issue)
	 *
	 * @batch
	 */
	deleteNodesAndRefresh(nodes?: Ti[]): Promise<void>;
}
