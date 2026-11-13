import type { RendererElement } from "vue";

import type { tFormInput, iInvalidInput } from "@open-xamu-co/ui-common-types";

import type { iUseThemeProps } from "./base";

export interface iFormSimple<P extends any[]> extends iUseThemeProps {
	title?: string;
	emptyMessage?: string;
	modelValue?: tFormInput[];
	noForm?: boolean;
	invalid?: iInvalidInput[];
	/**
	 * If the make function requires a payload
	 */
	payload?: P;
	/**
	 * Make model
	 */
	make?: ((...args: P) => tFormInput[]) | ((...args: P) => Promise<tFormInput[]>);
	/** Make all inputs read only by disabling them */
	readonly?: boolean;
	/**
	 * Target element to append the modal to
	 *
	 * Another modal could be the target so it appears nested
	 *
	 * @default body
	 */
	target?: string | RendererElement;
}
