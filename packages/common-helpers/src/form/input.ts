import type { IconName } from "@fortawesome/fontawesome-common-types";
import isEqual from "lodash-es/isEqual.js";

import type {
	iFormInput,
	iFormInputDefault,
	iFormValue,
	iSelectOption,
	tFormAutocomplete,
	tFormIcon,
} from "@open-xamu-co/ui-common-types";
import { eFormType, eFormTypeSimple, eFormTypeComplex } from "@open-xamu-co/ui-common-enums";

import { toOption } from "../format.js";

/**
 * get form input icon
 */
function getIcon(
	icon?: IconName | tFormIcon,
	type?: eFormTypeSimple | eFormTypeComplex
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
function getDefault<V extends iFormValue = iFormValue>(
	type?: eFormTypeSimple | eFormTypeComplex,
	defaults?: [iFormInputDefault, iFormInputDefault, ...iFormInputDefault[]]
): V | V[] {
	switch (type) {
		case eFormType.LOCATION:
			// 3 values
			return Array(3).fill("");
		case eFormType.ID:
		case eFormType.PHONE:
		case eFormType.CELLPHONE:
		case eFormType.NEW_PASSWORD:
			// 2 values
			return Array(2).fill("");
		default:
			// 1 value
			if (!defaults) return Array(1).fill("")[0];

			return Array(defaults.length).fill("");
	}
}

function isChoiceType(type: eFormTypeSimple | eFormTypeComplex): boolean {
	const types: (eFormTypeSimple | eFormTypeComplex)[] = [
		eFormType.CHOICE,
		eFormType.SELECT,
		eFormType.SELECT_FILTER,
	];

	return types.includes(type);
}

export class FormInputDefault<T extends eFormTypeSimple | eFormTypeComplex = eFormTypeSimple>
	implements iFormInputDefault<T>
{
	// public
	public type!: T;
	// public readonly
	public readonly required!: boolean;
	public readonly placeholder!: string;
	public readonly icon!: tFormIcon;
	public readonly autocomplete!: tFormAutocomplete;

	constructor(
		formInput: iFormInputDefault<T>,
		private _rerender?: (fi?: Partial<iFormInputDefault<T>>) => void
	) {
		this.required = formInput.required ?? false;

		if (formInput.type) this.type = formInput.type;
		if (formInput.placeholder) this.placeholder = formInput.placeholder;
		if (formInput.icon) this.icon = getIcon(formInput.icon, formInput.type);
		if (formInput.autocomplete) this.autocomplete = formInput.autocomplete;
	}

	/** Rerender component */
	public rerender(): void {
		this._rerender?.(this);
	}

	/**
	 * set rerender function
	 */
	public setRerender(rerender: (fi?: Partial<iFormInputDefault<T>>) => void) {
		this._rerender = rerender;

		return this;
	}
}

export class FormInput<V extends iFormValue = iFormValue>
	extends FormInputDefault<eFormTypeSimple | eFormTypeComplex>
	implements iFormInput<V>
{
	// private
	private _options!: iSelectOption[];
	private _values!: (V | V[])[];
	private _defaults?: [iFormInputDefault, iFormInputDefault, ...iFormInputDefault[]];
	// public readonly
	public readonly name!: string;
	public readonly title!: string;
	public readonly multiple!: boolean;
	public readonly min!: number;
	public readonly max!: number;

	/**
	 * Form input constructor
	 * @param formInput the base object to create an input form from
	 * @param _onUpdatedValues hook that is called when the values are updated
	 */
	constructor(
		formInput: iFormInput<V>,
		private _onUpdatedValues?: (updatedValues: (V | V[])[]) => (V | V[])[] | undefined | void,
		rerender?: (fi?: Partial<iFormInput<V>>) => void
	) {
		super(formInput, rerender);

		this._options = formInput.options?.map(toOption) ?? [];
		this.min = formInput.min ?? 1;

		// max cannot be lower than min or more than options if they exist
		const maxValue = this._options.length || formInput.max || 9e9;

		this.max = maxValue < this.min ? this.min : maxValue;

		const values = Array(this.min).fill(getDefault(formInput.type, formInput.defaults));

		this._values = formInput.values?.length ? formInput.values : values;

		// autoset single value if required
		if (
			this.required &&
			isChoiceType(this.type) &&
			this.options.length === 1 &&
			this._values[0] !== this.options[0].value
		) {
			this._values = [this.options[0].value as V];
		}

		this.name = formInput.name;
		this.multiple = formInput.multiple ?? false;

		if (formInput.defaults) this._defaults = formInput.defaults;
		if (formInput.title) this.title = formInput.title;
	}

	get options(): iSelectOption[] {
		return this._options;
	}
	set options(updatedOptions: iSelectOption[] | undefined) {
		this._options = updatedOptions || [];

		// autoset single value if required
		if (
			this.required &&
			isChoiceType(this.type) &&
			this.options.length === 1 &&
			this.values[0] !== this.options[0].value
		) {
			this.values = [this.options[0].value as V];
		}

		this.rerender();
	}

	get values(): (V | V[])[] {
		return this._values;
	}
	set values(updatedValues: (V | V[])[] | undefined) {
		if (updatedValues === undefined) {
			// set defaults
			this._values = Array(this.min).fill(getDefault(this.type, this.defaults));
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
	public addValue(newValue: V | V[] = getDefault(this.type, this.defaults)) {
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
		overrides?: Omit<iFormInput<V>, "name"> & { name?: string },
		onUpdatedValues?: (updatedValues: (V | V[])[]) => (V | V[])[] | undefined | void
	) {
		const oldFormInput: iFormInput<V> = {
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
	public getObject<Vi extends iFormValue = iFormValue>(input: FormInput<Vi>): iFormInput<Vi> {
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

export interface iForm {
	/**
	 * Optional form key
	 */
	key?: string;
	title?: string;
	inputs: FormInput[];
	listen?: boolean;
	/** Make all inputs read only by disabling them */
	readonly?: boolean;
	/** Message when no valid inputs are rendered */
	emptyMessage?: string;
}
