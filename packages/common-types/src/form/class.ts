import type {
	eFormTypeBase,
	eFormTypeSimple,
	eFormTypeComplex,
} from "@open-xamu-co/ui-common-enums";

import type {
	iFormInput,
	iFormInputDefault,
	iFormValue,
	tFormAutocomplete,
	tFormIcon,
} from "./types";
import type { iSelectOption } from "../values.js";

export declare abstract class tFormInputDefault<
	T extends eFormTypeBase | eFormTypeSimple | eFormTypeComplex = eFormTypeSimple,
> implements iFormInputDefault<T> {
	// public
	public type: T;
	// public readonly
	public readonly required: boolean;
	public readonly placeholder: string;
	public readonly icon?: tFormIcon;
	public readonly autocomplete?: tFormAutocomplete;

	/** Rerender component */
	public rerender(): void;

	/** Set rerender function */
	public setRerender(rerender: (fi?: Partial<iFormInputDefault<T>>) => void): this;
}

export declare abstract class tFormInput<
	V extends iFormValue | iFormValue[] = iFormValue | iFormValue[],
	T extends eFormTypeBase | eFormTypeSimple | eFormTypeComplex =
		| eFormTypeBase
		| eFormTypeSimple
		| eFormTypeComplex,
>
	extends tFormInputDefault<T>
	implements iFormInput<V, T>
{
	// public readonly
	public readonly name: string;
	public readonly title?: string;
	public readonly multiple: boolean;
	public readonly min: number;
	public readonly max: number;
	public readonly meta?: Record<string, any>;
	// public
	public options: iSelectOption[];
	public values: V[];
	public defaults?: [
		iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>,
		iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>,
		...iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>[],
	];
	/**
	 * set rerender function
	 *
	 * @override
	 */
	public setRerender(rerender: (fi?: Partial<iFormInput<V, T>>) => void): this;
	/**
	 * add new model to the models
	 */
	public addValue(newValue?: V): this;
	/**
	 * remove the given value from the values
	 */
	public removeValue(index: number): this;
	/**
	 * Clone this object
	 */
	public clone(
		overrides?: Omit<iFormInput<V, T>, "name"> & { name?: string },
		onUpdatedValues?: (
			updatedValues: V[]
		) => V[] | undefined | void | Promise<V[] | undefined | void>
	): tFormInput<V, T>;
	/**
	 * Check if this object is equal to another
	 */
	public isEqual(other: tFormInput): boolean;

	/**
	 * Get simple object
	 */
	static getObject<
		Vi extends iFormValue | iFormValue[],
		Ti extends eFormTypeBase | eFormTypeSimple | eFormTypeComplex = eFormTypeSimple,
	>(input: iFormInput<Vi, Ti>): iFormInput<Vi, Ti>;
}

export interface iForm {
	/**
	 * Optional form key
	 */
	key?: string;
	title?: string;
	inputs: tFormInput[];
	listen?: boolean;
	/** Make all inputs read only by disabling them */
	readonly?: boolean;
	/** Message when no valid inputs are rendered */
	emptyMessage?: string;
}
