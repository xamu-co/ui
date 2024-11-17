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
} from "@open-xamu-co/ui-common-types";
import type { AllowedComponentProps, RendererElement } from "vue";

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
	whatsapp?: boolean;
	download?: string;
}

interface iInputLikeProps {
	id?: string;
	name?: string;
	placeholder?: string;
	title?: string;
	required?: boolean;
	disabled?: boolean;
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
