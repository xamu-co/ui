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
	T extends eFormTypeBase | eFormTypeSimple | eFormTypeComplex = eFormTypeSimple.TEXT,
> implements iFormInputDefault<T>
{
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

export declare class tFormInput<V extends iFormValue = iFormValue, Vk extends V | V[] = V | V[]>
	extends tFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>
	implements iFormInput<V, Vk>
{
	// public readonly
	public readonly name: string;
	public readonly title?: string;
	public readonly multiple: boolean;
	public readonly min: number;
	public readonly max: number;
	// public
	public options: iSelectOption[];
	public values: Vk[];
	public defaults?: [iFormInputDefault, iFormInputDefault, ...iFormInputDefault[]];
	/**
	 * set rerender function
	 *
	 * @override
	 */
	public setRerender(rerender: (fi?: Partial<iFormInput<V>>) => void): this;
	/**
	 * add new model to the models
	 */
	public addValue(newValue?: Vk): this;
	/**
	 * remove the given value from the values
	 */
	public removeValue(index: number): this;

	/**
	 * Clone this object
	 */
	public clone(
		overrides?: Omit<iFormInput<V, Vk>, "name"> & { name?: string },
		onUpdatedValues?: (updatedValues: Vk[]) => Vk[] | undefined | void
	): tFormInput<V, Vk>;
	/**
	 * Get simple object
	 */
	public getObject<Vi extends iFormValue = iFormValue, Vik extends Vi | Vi[] = Vi>(
		input: iFormInput<Vi, Vik>
	): iFormInput<Vi, Vik>;

	public isEqual(other: tFormInput): boolean;
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
