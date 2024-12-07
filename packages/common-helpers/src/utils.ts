import type { iPluginOptions, tLogger, tProp, tPropsModifier } from "@open-xamu-co/ui-common-types";

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
 * create a new formdata object
 *
 * @export
 * @param {object} object object with the payload
 * @returns {FormData} fomrdata object from object
 */
function createFormData(object: Record<string, any>) {
	const formData = new FormData();

	for (const key in object) {
		const isFile =
			Array.isArray(object[key]) && object[key].every((entry: any) => entry instanceof File);

		if (!isFile) {
			formData.append(key, object[key]);

			continue;
		}

		// as file Input
		object[key].forEach((file: any) => formData.append(`${key}[]`, file));
	}

	return formData;
}

/**
 * create a new urlSearchParams object
 *
 * @export
 * @param {object} object object with the payload
 * @returns {URLSearchParams} urlSearchParams object from object
 */
function createUrlSearchParams(object: Record<string, any>) {
	const urlSearchParams = new URLSearchParams();

	for (const key in object) {
		urlSearchParams.append(key, object[key]);
	}

	return urlSearchParams;
}

/**
 * Simple logger
 *
 * @composable
 */
const logger: tLogger = (at, errorOrMessage, error) => {
	if (!error) {
		if (errorOrMessage instanceof Error) {
			console.error(at, errorOrMessage.message, errorOrMessage);

			return;
		} else if (typeof errorOrMessage === "string") {
			console.log(at, errorOrMessage);

			return;
		}
	} else if (typeof errorOrMessage === "string") {
		console.error(at, errorOrMessage, error);

		return;
	}

	console.error(at, "Unknown error", error);
};

/**
 * Utils Composable
 *
 * @composable
 */
export default function useUtils(options: iPluginOptions = {}) {
	const isBrowser = typeof window !== "undefined";
	const isTouchDevice = isBrowser && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

	return {
		logger: options.logger || logger,
		isBrowser,
		isTouchDevice,
		getModifierClasses,
		getPropData,
		createFormData,
		createUrlSearchParams,
	};
}
