import type { iPluginOptions, tProp, tPropsModifier } from "@open-xamu-co/ui-common-types";

interface igetModifiersArgs {
	modifier?: string;
	prefix?: string;
	divider?: string;
	/**
	 * internal usage only
	 */
	modifierClass?: `${string}--${string}`;
}

/**
 * Returns a valid HTML class string
 */
function getClassesString(classes: string | string[] | (string | string[])[]): string {
	return [...new Set([classes].flat(2))].join(" ").trim();
}

/**
 * returns the modifier classes
 *
 * @examples "--modifier", "--modifier-value", "suffi--modifier-value", "suffi--modifier"
 */
function getModifierClasses(
	values: tPropsModifier,
	config?: { modifier: string; divider?: string }
): string[];
function getModifierClasses(values: tProp[], config: { prefix: string }): string[];
function getModifierClasses(
	values: tPropsModifier,
	config?: { modifier: string; prefix: string; divider?: string }
): string[];
function getModifierClasses(
	values: tPropsModifier,
	config?: { modifierClass: `${string}--${string}` }
): string[];
function getModifierClasses(values: tPropsModifier, config: igetModifiersArgs = {}): string[] {
	if (!values) return [];

	const { prefix, modifier, divider } = {
		prefix: "",
		modifier: "",
		divider: "",
		// override defaults
		...config,
	};
	const modifierClass = config?.modifierClass || `${prefix}--${modifier}`;

	if (Array.isArray(values)) {
		return values
			.map((value) => {
				if (typeof value === "string") return modifierClass + divider + value;

				return Object.keys(value).map((key) => {
					// validate truthiness
					if (!!value[key]) return modifierClass + key;
				});
			})
			.flat(2)
			.filter((value): value is string => !!value);
	} else if (typeof values === "boolean") {
		return [modifierClass];
	}

	return getModifierClasses([values], { modifierClass });
}

/**
 * returns the compatible prop data
 * this function asumes your object only contains a key
 */
function getPropData<T extends string>(prop: tProp<T>, index = 0): T | undefined {
	if (typeof prop !== "string") {
		const [key, value] = Object.entries(prop)[index];

		if (!value) return undefined;

		return key as T;
	}

	return prop;
}

/**
 * Utils Composable
 *
 * @composable
 */
export default function useUtils(_options: iPluginOptions = {}) {
	const isBrowser = typeof window !== "undefined";
	const isTouchDevice = isBrowser && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

	return {
		isBrowser,
		isTouchDevice,
		getClassesString,
		getModifierClasses,
		getPropData,
	};
}
