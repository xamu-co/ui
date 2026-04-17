import type { eMimeType } from "@open-xamu-co/ui-common-enums";

export interface iMime {
	/**
	 * Mime type
	 * @example image/jpeg
	 */
	mime: string;
	/**
	 * Pattern to match
	 * @example [0xff, 0xd8, 0xff]
	 */
	pattern: number[];
	/**
	 * Mask to match
	 * @example [0xff, 0xff, 0xff]
	 */
	mask: number[];
	/**
	 * Mime type range
	 * @example eMimeType.IMAGE
	 */
	type: eMimeType;
}
