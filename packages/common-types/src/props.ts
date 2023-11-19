export type tProp<T extends string = string> = T | Record<T, boolean>;
export type tProps<T extends string = string> = tProp<T> | tProp<T>[];
export type tPropsModifier<T extends string = string> = boolean | tProps<T>;
