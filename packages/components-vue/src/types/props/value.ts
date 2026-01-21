import type { AllowedComponentProps } from "vue";

import type { iProperty, tProps, tSizeModifier } from "@open-xamu-co/ui-common-types";

import type { iUseThemeProps } from "./base";
import type { iModalProps } from "./modal";

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
	/**
	 * This type seems to collide with nuxt/vue types
	 * Setting it to any for compatibility
	 */
	readonly?: any;
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
