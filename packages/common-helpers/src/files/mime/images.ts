import type { iMime } from "@open-xamu-co/ui-common-types";
import { eMimeType } from "@open-xamu-co/ui-common-enums";

export const jpegMimeType: iMime = {
	mime: "image/jpeg",
	pattern: [0xff, 0xd8, 0xff],
	mask: [0xff, 0xff, 0xff],
	type: eMimeType.IMAGE,
};

export const pngMimeType: iMime = {
	mime: "image/png",
	pattern: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.IMAGE,
};

export const webpMimeType: iMime = {
	/**
	 * For webp we only check the RIFF and WEBP signature
	 * Size and VP8 or VP8L signature are not always present
	 *
	 * VP8: Lossy WebP
	 * VP8L: Lossless WebP
	 * VP8X: Extended WebP (alpha, animation, ICC, etc.)
	 */
	mime: "image/webp",
	pattern: [
		...[0x52, 0x49, 0x46, 0x46], // RIFF
		...[0x00, 0x00, 0x00, 0x00], // size (ignored)
		...[0x57, 0x45, 0x42, 0x50], // WEBP
		// 0x56, 0x50, // VP8 or VP8L
	],
	mask: [
		0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff,
		// 0xff, 0xff,
	],
	type: eMimeType.IMAGE,
};

export const bmpMimeType: iMime = {
	mime: "image/bmp",
	pattern: [0x42, 0x4d],
	mask: [0xff, 0xff],
	type: eMimeType.IMAGE,
};

export const iconMimeTypeA: iMime = {
	mime: "image/icon", // First variant
	pattern: [0x00, 0x00, 0x01, 0x00],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.IMAGE,
};

export const iconMimeTypeB: iMime = {
	mime: "image/icon", // Second variant
	pattern: [0x00, 0x00, 0x02, 0x00],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.IMAGE,
};

export const heicMimeType: iMime = {
	mime: "image/heic",
	pattern: [
		...[0x00, 0x00, 0x00, 0x18], // Box size (24 bytes)
		...[0x66, 0x74, 0x79, 0x70], // 'ftyp' box
		...[0x68, 0x65, 0x69, 0x63], // 'heic' brand
	],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.IMAGE,
};

export const heifMimeType: iMime = {
	mime: "image/heif",
	pattern: [
		...[0x00, 0x00, 0x00, 0x18], // Box size (24 bytes)
		...[0x66, 0x74, 0x79, 0x70], // 'ftyp' box
		...[0x68, 0x65, 0x69, 0x66], // 'heif' brand
	],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.IMAGE,
};

export const heicSequenceMimeType: iMime = {
	mime: "image/heic-sequence",
	pattern: [
		...[0x00, 0x00, 0x00, 0x18], // Box size (24 bytes)
		...[0x66, 0x74, 0x79, 0x70], // 'ftyp' box
		...[0x68, 0x65, 0x76, 0x63], // 'hevc' brand (HEVC sequence)
	],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.IMAGE,
};

export const heifSequenceMimeType: iMime = {
	mime: "image/heif-sequence",
	pattern: [
		...[0x00, 0x00, 0x00, 0x18], // Box size (24 bytes)
		...[0x66, 0x74, 0x79, 0x70], // 'ftyp' box
		...[0x6d, 0x69, 0x66, 0x31], // 'mif1' brand (HEIF sequence)
	],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.IMAGE,
};

export const gifMimeTypeA: iMime = {
	mime: "image/gif", // First variant
	pattern: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.IMAGE,
};

export const gifMimeTypeB: iMime = {
	mime: "image/gif", // Second variant
	pattern: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.IMAGE,
};

/**
 * Standard image Mime types array
 * you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
 */
export const standardStillImageMimeTypes: iMime[] = [jpegMimeType, pngMimeType];

export const extendedStillImageMimeTypes: iMime[] = [
	...standardStillImageMimeTypes,
	webpMimeType,
	bmpMimeType,
	iconMimeTypeA,
	iconMimeTypeB,
];

/**
 * Apple still image mime types array
 */
export const appleStillImageMimeTypes: iMime[] = [heicMimeType, heifMimeType];

/**
 * Apple sequence image mime types array
 */
export const appleSequenceImageMimeTypes: iMime[] = [heicSequenceMimeType, heifSequenceMimeType];

/**
 * Apple image mime types array
 * @see https://www.iana.org/assignments/media-types/media-types.xhtml#image
 */
export const appleImageMimeTypes: iMime[] = [
	...appleStillImageMimeTypes,
	...appleSequenceImageMimeTypes,
];

/**
 * Still image mime types array
 */
export const stillImageMimeTypes: iMime[] = [
	...extendedStillImageMimeTypes,
	...appleStillImageMimeTypes,
];

/**
 * Moving image mimetypes array
 */
export const gifImageMimeTypes: iMime[] = [gifMimeTypeA, gifMimeTypeB];

/**
 * All supported image mimetype array
 */
export const imageMimeTypes: iMime[] = [...gifImageMimeTypes, ...stillImageMimeTypes];

/**
 * Create base64 image string from image file
 */
export function getBase64FromImageFile(file: File): Promise<string> {
	// Check if file is a image file
	if (!file.type.startsWith("image/")) throw new Error("File is not a image file");

	// build base64 image string
	const reader = new FileReader();

	return new Promise<string>((resolve) => {
		reader.onload = (e) => {
			resolve(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	});
}
