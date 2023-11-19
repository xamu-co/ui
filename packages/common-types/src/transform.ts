/**
 * Allows prefixing & suffixing of object properties
 *
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
 */
export type tPropertyMapping<
	T extends Record<string, unknown>,
	Prefix extends string = "",
	Suffix extends string = "",
> = {
	[K in keyof T as `${Prefix}${Capitalize<string & K>}${Capitalize<string & Suffix>}`]: T[K];
};
