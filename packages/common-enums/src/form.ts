export enum eFormTypeBase {
	// miscellaneous
	HIDDEN = "HIDDEN",
}

export enum eFormTypeSimple {
	// Select, options are required
	SELECT = "SELECT",
	SELECT_FILTER = "SELECT_FILTER",
	CHOICE = "CHOICE",
	// File
	FILE = "FILE",
	// Boolean
	BOOLEAN = "BOOLEAN",
	// Text
	TEXT = "TEXT",
	EMAIL = "EMAIL",
	NUMBER = "NUMBER",
	PASSWORD = "PASSWORD",
	// Longtext
	LONGTEXT = "LONGTEXT",
	// Code
	CODE = "CODE",
	// Color
	COLOR = "COLOR",
}

export enum eFormTypeComplex {
	// New password
	NEW_PASSWORD = "NEW_PASSWORD",
	// Cellphone
	CELLPHONE = "CELLPHONE",
	PHONE = "PHONE",
	// Id
	ID = "ID",
	// Schedule
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
