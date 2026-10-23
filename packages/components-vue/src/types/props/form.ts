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
}
