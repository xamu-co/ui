export enum eFormTypeBase {
	// miscellaneous
	HIDDEN = "HIDDEN",
}

export enum eFormTypeSimple {
	// select, options are required
	SELECT = "SELECT",
	SELECT_FILTER = "SELECT_FILTER",
	CHOICE = "CHOICE",
	// file
	FILE = "FILE",
	// boolean
	BOOLEAN = "BOOLEAN",
	// text
	TEXT = "TEXT",
	EMAIL = "EMAIL",
	NUMBER = "NUMBER",
	PASSWORD = "PASSWORD",
	// longtext
	LONGTEXT = "LONGTEXT",
	// color
	COLOR = "COLOR",
}

export enum eFormTypeComplex {
	// new password
	NEW_PASSWORD = "NEW_PASSWORD",
	// phone
	CELLPHONE = "CELLPHONE",
	PHONE = "PHONE",
	// id
	ID = "ID",
	// schedule
	SCHEDULE = "SCHEDULE",
	/**
	 * Single value means country, 3 values mean country, state, city
	 */
	LOCATION = "LOCATION",
}

/**
 * Form types
 */
export const eFormType = {
	...eFormTypeBase,
	...eFormTypeSimple,
	...eFormTypeComplex,
};
export type eFormType = typeof eFormType;
