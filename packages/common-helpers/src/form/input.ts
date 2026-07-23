import type { IconName } from "@fortawesome/fontawesome-common-types";
import isEqual from "lodash-es/isEqual";

import type {
	iFormInput,
	iFormInputDefault,
	iFormOption,
	iFormValue,
	tFormAutocomplete,
	tFormIcon,
	tFormInputDefault,
	tOptionsLoaderFn,
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
function getDefault<V extends iFormValue | iFormValue[]>(
	type?: eFormTypeBase | eFormTypeSimple | eFormTypeComplex,
	defaults?: [
		iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>,
		iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>,
		...iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>[],
	]
): V {
	switch (type) {
		case eFormType.BOOLEAN:
			return false as V;
		case eFormType.LOCATION:
			// 3 values
			return Array(3).fill("") as V;
		case eFormType.ID:
		case eFormType.PHONE:
		case eFormType.CELLPHONE:
		case eFormType.NEW_PASSWORD:
			// 2 values
			return Array(2).fill("") as V;
		default:
			// 1 value
			if (!defaults) return Array(1).fill("")[0];

			return Array(defaults.length).fill("") as V;
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
> implements tFormInputDefault<T> {
	// public
	public type: T;
	public required: boolean;
	// public readonly
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

export class FormInput<
	V extends iFormValue | iFormValue[] = iFormValue | iFormValue[],
	T extends eFormTypeBase | eFormTypeSimple | eFormTypeComplex =
		eFormTypeBase | eFormTypeSimple | eFormTypeComplex,
>
	extends FormInputDefault<T>
	implements iFormInput<V, T>
{
	// private
	private _options: iFormOption[];
	private _values: V[];
	private _defaults?: [
		iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>,
		iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>,
		...iFormInputDefault<eFormTypeBase | eFormTypeSimple | eFormTypeComplex>[],
	];
	// public
	public multiple: boolean;
	public min: number;
	public max: number;
	public meta: Record<string, any>;
	// public readonly
	public readonly name: string;
	public readonly title?: string;
	public readonly optionsFilter?: tOptionsLoaderFn;

	/**
	 * Form input constructor
	 * @param formInput the base object to create an input form from
	 * @param _onUpdatedValues hook that is called when the values are updated
	 */
	constructor(
		formInput: iFormInput<V, T>,
		private _onUpdatedValues?: (
			updatedValues: V[]
		) => V[] | undefined | void | Promise<V[] | undefined | void>,
		rerender?: (fi?: Partial<iFormInput<V, T>>) => void
	) {
		super(formInput, rerender);

		this.name = formInput.name;
		this.multiple = formInput.multiple ?? false;
		this.title = formInput.title;

		// Initialize options array, skip if function
		if (Array.isArray(formInput.options)) {
			this._options = formInput.options.map(toOption);
			this.optionsFilter = undefined;
		} else {
			this._options = [];
			this.optionsFilter = formInput.options;
		}

		this._defaults = formInput.defaults;
		this.min = formInput.min ?? 1;
		this.meta = formInput.meta || {};

		// Max cannot be lower than min or more than options if they exist
		const maxValue = this._options.length || formInput.max || 9e9;

		this.max = maxValue < this.min ? this.min : maxValue;
		this._values = formInput.values ||= [];

		if (isChoiceType(this.type)) {
			// Autoset values if required
			if (this.required && !this._values.length) this.autosetValues();
		} else if (this.type !== eFormType.FILE) {
			const length = Math.max(1, this.min); // Negative values fallback
			const values = Array(length).fill(getDefault(formInput.type, formInput.defaults));

			// Use defaults
			if (this._values.length < length) this._values = values;
		}
	}

	get options(): iFormOption[] {
		return this._options;
	}
	set options(updatedOptions: iFormOption[] | undefined) {
		this._options = updatedOptions || [];

		if (isChoiceType(this.type)) {
			// Autoset values if required
			if (this.required && !this._values.length) this.autosetValues();
		}

		this.rerender();
	}

	get values(): V[] {
		return this._values;
	}
	set values(updatedValues: V[] | undefined) {
		if (updatedValues === undefined) {
			// set defaults
			this._values = [];

			if (isChoiceType(this.type)) {
				// Autoset values if required
				if (this.required && !this._values.length) this.autosetValues();
			} else if (this.type !== eFormType.FILE) {
				const length = Math.max(1, this.min); // negative values fallback
				const values = Array(length).fill(getDefault(this.type, this.defaults));

				// use defaults
				if (this._values.length < length) this._values = values;
			}
		} else {
			this._values = updatedValues;

			// run hook on values change
			Promise.resolve(this._onUpdatedValues?.(updatedValues)).then((values) => {
				if (values) this._values = values;
			});
		}
	}

	get defaults() {
		return this._defaults;
	}
	set defaults(updatedDefaults) {
		this._defaults = updatedDefaults;
		this.rerender();
	}

	/** Autoset values */
	private autosetValues() {
		// Autoset if there are no options filter
		if (this.optionsFilter) return;

		const autosetValuesArr = [];

		for (let i = 0; i < Math.max(1, this.min); i++) {
			const option = this._options[i];

			autosetValuesArr.push((option?.value || "") as V);
		}

		this._values = autosetValuesArr as V[];
	}

	/**
	 * set rerender function
	 *
	 * @override
	 */
	public setRerender(rerender: (fi?: Partial<iFormInput<V, T>>) => void) {
		super.setRerender(rerender);

		return this;
	}

	/**
	 * add new model to the models
	 */
	public addValue(newValue: V = getDefault(this.type, this.defaults)) {
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
		{ values, ...overrides }: Omit<iFormInput<V, T>, "name"> & { name?: string } = {},
		onUpdatedValues?: (
			updatedValues: V[]
		) => V[] | undefined | void | Promise<V[] | undefined | void>
	): FormInput<V, T> {
		const oldFormInput: iFormInput<V, T> = {
			...this,
			options: this.optionsFilter || this.options,
			values: [...this.values],
			meta: { ...this.meta },
			defaults: this.defaults ? [...this.defaults] : undefined,
		};

		const clonedInput = new FormInput(
			{ ...oldFormInput, ...overrides },
			onUpdatedValues ?? this._onUpdatedValues,
			this.rerender
		);

		// overwrite values if provided, trigger onUpdatedValues hook
		if (values) clonedInput.values = values;

		return clonedInput;
	}

	public isEqual(other: FormInput<any, any>): boolean {
		return isEqual(FormInput.getObject(this), FormInput.getObject(other));
	}

	/**
	 * Get simple object
	 */
	static getObject<
		Vi extends iFormValue | iFormValue[] = iFormValue | iFormValue[],
		Ti extends eFormTypeBase | eFormTypeSimple | eFormTypeComplex = eFormTypeSimple,
	>(input: iFormInput<Vi, Ti>): iFormInput<Vi, Ti> {
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
}
