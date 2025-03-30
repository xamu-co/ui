import { eSizes, eColors } from "@open-xamu-co/ui-common-enums";

/**
 * Union of supported colors.
 * @colors
 */
export type tThemeModifier = (typeof eColors)[keyof typeof eColors]; // to union
export type tThemeTuple = [tThemeModifier, tThemeModifier?];

/**
 * Allowed sizes
 */
export type tSizeModifier = (typeof eSizes)[keyof typeof eSizes]; // to union
