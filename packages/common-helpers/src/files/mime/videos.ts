import type { iMime } from "@open-xamu-co/ui-common-types";
import { eMimeType } from "@open-xamu-co/ui-common-enums";

export const mp4MimeType: iMime = {
	mime: "video/mp4",
	// We use null (0x00) for the first 4 bytes in the mask to ignore the size
	pattern: [0x00, 0x00, 0x00, 0x00, 0x66, 0x74, 0x79, 0x70],
	mask: [0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.VIDEO,
};

/** * WebM & MKV (Simplified)
 * These share the EBML header. Since EBML is dynamic, we look for
 * the magic number and the DocType string shortly after.
 */
export const webmMimeType: iMime = {
	mime: "video/webm",
	pattern: [
		...[0x1a, 0x45, 0xdf, 0xa3], // EBML magic
		...[0x00, 0x00, 0x00, 0x00], // variable EBML fields (ignored)
		...[0x77, 0x65, 0x62, 0x6d], // DocType: 'webm'
	],
	mask: [
		...[0xff, 0xff, 0xff, 0xff], // EBML magic
		...[0x00, 0x00, 0x00, 0x00], // variable fields (ignored)
		...[0xff, 0xff, 0xff, 0xff], // DocType
	],
	type: eMimeType.VIDEO,
};

/** * OGG / OGV
 * Spec requires 'OggS' followed by a null byte.
 */
export const oggMimeType: iMime = {
	mime: "video/ogg",
	pattern: [0x4f, 0x67, 0x67, 0x53, 0x00],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.VIDEO,
};

/** * AVI
 * Pattern: RIFF (4 bytes) + Size (4 bytes) + AVI (4 bytes)
 */
export const aviMimeType: iMime = {
	mime: "video/x-msvideo",
	pattern: [0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x41, 0x56, 0x49, 0x20],
	mask: [0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.VIDEO,
};

/** * QuickTime / MOV
 * Similar to MP4, uses 'ftypqt' or 'moov'.
 * This version ignores the size and looks for 'ftyp' (standard compliant).
 */
export const movMimeType: iMime = {
	mime: "video/quicktime",
	pattern: [0x00, 0x00, 0x00, 0x00, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74],
	mask: [0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.VIDEO,
};

/** Matroska / MKV
 * Uses EBML header (0x1A 0x45 0xDF 0xA3) + DocType 'matroska'
 * Bytes 4-9 are variable EBML fields (size, versions), ignored via 0x00 mask
 */
export const mkvMimeType: iMime = {
	mime: "video/x-matroska",
	pattern: [
		...[0x1a, 0x45, 0xdf, 0xa3], // EBML magic
		...[0x00, 0x00, 0x00, 0x00, 0x00, 0x00], // variable EBML fields (ignored)
		...[0x6d, 0x61, 0x74, 0x72, 0x6f, 0x73, 0x6b, 0x61], // DocType: 'matroska'
	],
	mask: [
		...[0xff, 0xff, 0xff, 0xff], // EBML magic
		...[0x00, 0x00, 0x00, 0x00, 0x00, 0x00], // variable fields (ignored)
		...[0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff], // DocType
	],
	type: eMimeType.VIDEO,
};

/** Flash Video / FLV */
export const flvMimeType: iMime = {
	mime: "video/x-flv",
	pattern: [0x46, 0x4c, 0x56],
	mask: [0xff, 0xff, 0xff],
	type: eMimeType.VIDEO,
};

/** Windows Media Video / WMV */
export const wmvMimeType: iMime = {
	mime: "video/x-ms-wmv",
	pattern: [0x30, 0x26, 0xb2, 0x75],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.VIDEO,
};

/** MPEG-1 / MPEG-2 */
export const mpegMimeType: iMime = {
	mime: "video/mpeg",
	pattern: [0x00, 0x00, 0x01, 0xba],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.VIDEO,
};

/** 3GPP */
export const threegpMimeType: iMime = {
	mime: "video/3gpp",
	pattern: [0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70, 0x33, 0x67],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.VIDEO,
};

/**
 * Standard video mime types array (MP4, WebM, OGG)
 */
export const standardVideoMimeTypes: iMime[] = [mp4MimeType, webmMimeType, oggMimeType];

/**
 * Modern container video mime types array
 */
export const modernVideoMimeTypes: iMime[] = [...standardVideoMimeTypes, mkvMimeType, movMimeType];

/**
 * Legacy video mime types array
 */
export const legacyVideoMimeTypes: iMime[] = [aviMimeType, flvMimeType, wmvMimeType, mpegMimeType];

/**
 * Mobile video mime types array
 */
export const mobileVideoMimeTypes: iMime[] = [mp4MimeType, threegpMimeType, movMimeType];

/**
 * All supported video mime types array
 */
export const videoMimeTypes: iMime[] = [
	...modernVideoMimeTypes,
	...legacyVideoMimeTypes,
	threegpMimeType,
];
