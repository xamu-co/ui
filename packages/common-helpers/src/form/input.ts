import type { IconName } from "@fortawesome/fontawesome-common-types";
import isEqual from "lodash-es/isEqual";

import type {
	iFormInput,
	iFormInputDefault,
	iFormValue,
	iSelectOption,
	tFormAutocomplete,
	tFormIcon,
	tFormInputDefault,
} from "@open-xamu-co/ui-common-types";
import {
	eFormType,
	eFormTypeBase,
	eFormTypeSimple,
	eFormTypeComplex,
} from "@open-xamu-co/ui-common-enums";

import { toOption } from "../format";

/**
 * get form input icon
 */
function getIcon(
	icon?: IconName | tFormIcon,
	type?: eFormTypeBase | eFormTypeSimple | eFormTypeComplex
): tFormIcon {
	if (icon) return Array.isArray(icon) ? icon : [icon, {}];

	switch (type) {
		case eFormType.NEW_PASSWORD:
		case eFormType.PASSWORD:
			return ["lock", {}];
		case eFormType.EMAIL:
			return ["at", {}];
		case eFormType.PHONE:
			return ["phone-flip", {}];
		case eFormType.CELLPHONE:
			return ["mobile-screen-button", {}];
		case eFormType.ID:
			return ["id-card", {}];
	}

	return [undefined, {}];
}
/**
 * get form input default
 */
function getDefault<V extends iFormValue = iFormValue, Vk extends V | V[] = V>(
	type?: eFormTypeBase | eFormTypeSimple | eFormTypeComplex,
	defaults?: [iFormInputDefault, iFormInputDefault, ...iFormInputDefault[]]
): Vk {
	switch (type) {
		case eFormType.LOCATION:
			// 3 values
			return Array(3).fill("") as Vk;
		case eFormType.ID:
		case eFormType.PHONE:
		case eFormType.CELLPHONE:
		case eFormType.NEW_PASSWORD:
			// 2 values
			return Array(2).fill("") as Vk;
		default:
			// 1 value
			if (!defaults) return Array(1).fill("")[0];

			return Array(defaults.length).fill("") as Vk;
	}
}

function isChoiceType(type: eFormTypeBase | eFormTypeSimple | eFormTypeComplex): boolean {
	const types: (eFormTypeBase | eFormTypeSimple | eFormTypeComplex)[] = [
		eFormType.CHOICE,
		eFormType.SELECT,
		eFormType.SELECT_FILTER,
	];

	return types.includes(type);
}

export abstract class FormInputDefault<
	T extends eFormTypeBase | eFormTypeSimple | eFormTypeComplex = eFormTypeSimple.TEXT,
> implements tFormInputDefault<T>
{
	// public
	public type: T;
	// public readonly
	public readonly required: boolean;
	public readonly placeholder: string;
	public readonly icon?: tFormIcon;
	public readonly autocomplete?: tFormAutocomplete;

	constructor(
		formInput: iFormInputDefault<T>,
		private _rerender?: (fi?: Partial<iFormInputDefault<T>>) => void
	) {
		this.type = formInput.type || (eFormTypeSimple.TEXT as T);
		this.required = formInput.required ?? false;
		this.placeholder = formInput.placeholder || "";
		this.autocomplete = formInput.autocomplete;

		if (formInput.icon) this.icon = getIcon(formInput.icon, formInput.type);
	}

	/** Rerender component */
	public rerender(): void {
		this._rerender?.(this);
	}

	/** set rerender function */
	public setRerender(rerender: (fi?: Partial<iFormInputDefault<T>>) => void) {
		this._rerender = rerender;

		return this;
	}
}

export class FormInput<V extends iFormValue = iFormValue, Vk extends V | V[] = V | V[]>
	extends FormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>
	implements iFormInput<V, Vk>
{
	// private
	private _options: iSelectOption[];
	private _values: Vk[];
	private _defaults?: [iFormInputDefault, iFormInputDefault, ...iFormInputDefault[]];
	// public readonly
	public readonly name: string;
	public readonly title?: string;
	public readonly multiple: boolean;
	public readonly min: number;
	public readonly max: number;

	/**
	 * Form input constructor
	 * @param formInput the base object to create an input form from
	 * @param _onUpdatedValues hook that is called when the values are updated
	 */
	constructor(
		formInput: iFormInput<V, Vk>,
		private _onUpdatedValues?: (updatedValues: Vk[]) => Vk[] | undefined | void,
		rerender?: (fi?: Partial<iFormInput<V, Vk>>) => void
	) {
		super(formInput, rerender);

		this.name = formInput.name;
		this.multiple = formInput.multiple ?? false;
		this.title = formInput.title;
		this._options = formInput.options?.map(toOption) ?? [];
		this._defaults = formInput.defaults;
		this.min = formInput.min ?? 1;

		// max cannot be lower than min or more than options if they exist
		const maxValue = this._options.length || formInput.max || 9e9;

		this.max = maxValue < this.min ? this.min : maxValue;
		this._values = formInput.values ||= [];

		if (isChoiceType(this.type)) {
			// autoset single value if required
			if (this.required && !this._values.length) {
				const values = this.options.map(({ value }) => value);

				this._values = values.slice(0, Math.max(1, this.min)) as Vk[];
			}
		} else if (this.type !== eFormType.FILE) {
			const length = Math.max(1, this.min); // negative values fallback
			const values = Array(length).fill(getDefault(formInput.type, formInput.defaults));

			// use defaults
			if (this._values.length < length) this._values = values;
		}
	}

	get options(): iSelectOption[] {
		return this._options;
	}
	set options(updatedOptions: iSelectOption[] | undefined) {
		this._options = updatedOptions || [];

		if (isChoiceType(this.type)) {
			// autoset single value if required
			if (this.required && !this._values.length) {
				const values = <Vk[]>this.options.map(({ value }) => value);

				this._values = values.slice(0, Math.max(1, this.min));
			}
		}

		this.rerender();
	}

	get values(): Vk[] {
		return this._values;
	}
	set values(updatedValues: Vk[] | undefined) {
		if (updatedValues === undefined) {
			// set defaults
			this._values = [];

			if (isChoiceType(this.type)) {
				// autoset single value if required
				if (this.required && !this._values.length) {
					const values = <Vk[]>this.options.map(({ value }) => value);

					this._values = values.slice(0, Math.max(1, this.min));
				}
			} else if (this.type !== eFormType.FILE) {
				const length = Math.max(1, this.min); // negative values fallback
				const values = Array(length).fill(getDefault(this.type, this.defaults));

				// use defaults
				if (this._values.length < length) this._values = values;
			}
		} else {
			// run hook on values change
			this._values = this._onUpdatedValues?.(updatedValues) ?? updatedValues;
		}
	}

	get defaults(): [iFormInputDefault, iFormInputDefault, ...iFormInputDefault[]] | undefined {
		return this._defaults;
	}
	set defaults(
		updatedDefaults: [iFormInputDefault, iFormInputDefault, ...iFormInputDefault[]] | undefined
	) {
		this._defaults = updatedDefaults;
		this.rerender();
	}

	/**
	 * set rerender function
	 *
	 * @override
	 */
	public setRerender(rerender: (fi?: Partial<iFormInput<V>>) => void) {
		super.setRerender(rerender);

		return this;
	}

	/**
	 * add new model to the models
	 */
	public addValue(newValue: Vk = getDefault(this.type, this.defaults)) {
		if (this.values.length < this.max) {
			this.values = [...this.values, newValue];
		}

		return this;
	}
	/**
	 * remove the given value from the values
	 */
	public removeValue(index: number) {
		if (this.values.length > this.min) {
			this.values = this.values.toSpliced(index, 1);
		}

		return this;
	}

	/**
	 * Clone this object
	 */
	public clone(
		overrides?: Omit<iFormInput<V, Vk>, "name"> & { name?: string },
		onUpdatedValues?: (updatedValues: Vk[]) => Vk[] | undefined | void
	) {
		const oldFormInput: iFormInput<V, Vk> = {
			...this,
			options: this.options,
			values: this.values,
			defaults: this.defaults,
		};

		return new FormInput(
			{ ...oldFormInput, ...overrides },
			onUpdatedValues || this._onUpdatedValues,
			this.rerender
		);
	}

	/**
	 * Get simple object
	 */
	public getObject<Vi extends iFormValue = iFormValue, Vik extends Vi | Vi[] = Vi>(
		input: iFormInput<Vi, Vik>
	): iFormInput<Vi, Vik> {
		return {
			required: input.required,
			type: input.type,
			options: input.options,
			placeholder: input.placeholder,
			icon: input.icon,
			autocomplete: input.autocomplete,
			min: input.min,
			max: input.max,
			name: input.name,
			values: input.values,
			defaults: input.defaults,
			title: input.title,
			multiple: input.multiple,
		};
	}

	public isEqual(other: FormInput): boolean {
		return isEqual(this.getObject(this), this.getObject(other));
	}
}
