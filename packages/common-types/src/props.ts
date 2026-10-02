export type tProp<T extends string = string> = T | Record<T, boolean>;
export type tProps<T extends string = string> = tProp<T> | tProp<T>[];
export type tPropsModifier<T extends string = string> = boolean | tProps<T>;

/**
 * Country indicative code type
 * @example CO+57, US+1
 */
export type tIndicative = `${string}+${number}`;
