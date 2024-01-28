import type {
	iFormOption,
	tFormAutocomplete,
	tIndicative,
	tProp,
	tProps,
	tPropsModifier,
	tThemeModifier,
	tThemeTuple,
} from "@open-xamu-co/ui-common-types";

export interface iUseModifiersProps {
	hidden?: string | tPropsModifier<string>;
	size?: string | number;
}

export interface iUseStateProps {
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
}

export interface iUseThemeTooltipProps {
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
