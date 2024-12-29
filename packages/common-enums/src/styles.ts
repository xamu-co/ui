/**
 * Media queries used in the project
 * @mq
 */
export enum eMQ {
	TV = "(max-width: 1280px)",
	LAPTOP = "(max-width: 1080px)",
	TABLET = "(max-width: 768px)",
	MOBILE = "(max-width: 576px)",
	SMARTWATCH = "(max-width: 358px)",
}

/**
 * Theme colors
 * basics: should match scss theme variables.
 * should be supported everywhere.
 * @colors
 */
export enum eThemeColors {
	PRIMARY = "primary",
	PRIMARY_COMPLEMENT = "primary-complement",
	SECONDARY = "secondary",
	SECONDARY_COMPLEMENT = "secondary-complement",
	DANGER = "danger",
	SUCCESS = "success",
	WARNING = "warning",
}

/**
 * Base colors
 * basics: should match scss theme variables.
 * should be supported everywhere.
 * @colors
 */
export enum eBaseColors {
	LIGHT = "light",
	DARK = "dark",
}

/**
 * Base colors
 * basics: should match scss theme variables.
 * should be supported everywhere.
 * @colors
 */
export const eColors = {
	...eThemeColors,
	...eBaseColors,
};
export type eColors = typeof eColors;

export enum eSizes {
	XS = "xs",
	SM = "sm",
	MD = "md",
	LG = "lg",
	XL = "xl",
	XX = "xx",
	MX = "mx",
}
