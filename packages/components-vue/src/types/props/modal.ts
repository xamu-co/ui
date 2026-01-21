import type { RendererElement } from "vue";

import type { iUseThemeProps } from "./base";

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
	 * This should not depend on any internal state
	 *
	 * @example User does not have enough permissions
	 */
	hide?: boolean;
	/** Message to show when modal is hidden */
	hideMessage?: string;
	/** Hides the footer */
	hideFooter?: boolean;
	/** disables modal */
	disabled?: boolean;
	/**
	 * Target element to append the modal to
	 *
	 * Another modal could be the target so it appears nested
	 *
	 * @default body
	 */
	target?: string | RendererElement;
	// PRIVATE
	/**
	 * Shows/hides the modal
	 * @private
	 */
	modelValue?: boolean;
}
