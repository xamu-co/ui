import type { eMimeType } from "@open-xamu-co/ui-common-enums";

export interface iMime {
	/**
	 * Mime type
	 * @example image/jpeg
	 */
	mime: string;
	/**
	 * Pattern to match (optional for text files without fixed magic bytes)
	 * @example [0xff, 0xd8, 0xff]
	 */
	pattern?: number[];
	/**
	 * Mask to match (optional for text files without fixed magic bytes)
	 * @example [0xff, 0xff, 0xff]
	 */
	mask?: number[];
	/**
	 * Mime type range
	 * @example eMimeType.IMAGE
	 */
	type: eMimeType;
	/**
	 * Associated file extensions without leading dot (used to disambiguate shared container formats)
	 * @example ['docx'], ['zip']
	 */
	extensions?: string[];
}
