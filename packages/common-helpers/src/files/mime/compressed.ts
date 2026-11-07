import type { iMime } from "@open-xamu-co/ui-common-types";
import { eMimeType } from "@open-xamu-co/ui-common-enums";

/** Standard ZIP archive ('PK\x03\x04') */
export const zipMimeType: iMime = {
	mime: "application/zip",
	pattern: [0x50, 0x4b, 0x03, 0x04],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.COMPRESSED,
	extensions: ["zip"],
};

/** Empty ZIP archive ('PK\x05\x06') */
export const zipEmptyMimeType: iMime = {
	mime: "application/zip",
	pattern: [0x50, 0x4b, 0x05, 0x06],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.COMPRESSED,
	extensions: ["zip"],
};

/** Spanned ZIP archive ('PK\x07\x08') */
export const zipSpannedMimeType: iMime = {
	mime: "application/zip",
	pattern: [0x50, 0x4b, 0x07, 0x08],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.COMPRESSED,
	extensions: ["zip"],
};

/** RAR archive version 1.5 to 4.x ('Rar!\x1a\x07\x00') */
export const rarMimeTypeA: iMime = {
	mime: "application/vnd.rar",
	pattern: [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x00],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.COMPRESSED,
	extensions: ["rar"],
};

/** RAR archive version 5.0+ ('Rar!\x1a\x07\x01\x00') */
export const rarMimeTypeB: iMime = {
	mime: "application/vnd.rar",
	pattern: [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x01, 0x00],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.COMPRESSED,
	extensions: ["rar"],
};

/** Standard ZIP mime types */
export const zipMimeTypes: iMime[] = [zipMimeType, zipEmptyMimeType, zipSpannedMimeType];

/** RAR mime types */
export const rarMimeTypes: iMime[] = [rarMimeTypeA, rarMimeTypeB];

/** All supported compressed archive mime types */
export const compressedMimeTypes: iMime[] = [...zipMimeTypes, ...rarMimeTypes];
