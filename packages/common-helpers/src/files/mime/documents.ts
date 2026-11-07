import type { iMime } from "@open-xamu-co/ui-common-types";
import { eMimeType } from "@open-xamu-co/ui-common-enums";

/** PDF — Portable Document Format ('%PDF-') */
export const pdfMimeType: iMime = {
	mime: "application/pdf",
	pattern: [0x25, 0x50, 0x44, 0x46, 0x2d],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.DOCUMENT,
	extensions: ["pdf"],
};

/**
 * Microsoft Office 97-2003 Legacy OLE Compound Document formats (.doc, .xls, .ppt)
 * All share the 8-byte Compound File Binary Format (CFBF) header: D0 CF 11 E0 A1 B1 1A E1
 */
export const docMimeType: iMime = {
	mime: "application/msword",
	pattern: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.DOCUMENT,
	extensions: ["doc"],
};

export const xlsMimeType: iMime = {
	mime: "application/vnd.ms-excel",
	pattern: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.DOCUMENT,
	extensions: ["xls"],
};

export const pptMimeType: iMime = {
	mime: "application/vnd.ms-powerpoint",
	pattern: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
	mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	type: eMimeType.DOCUMENT,
	extensions: ["ppt"],
};

/**
 * Microsoft Office OpenXML formats (.docx, .xlsx, .pptx)
 * ZIP-packaged XML containers starting with standard PKZIP magic bytes: 50 4B 03 04
 */
export const docxMimeType: iMime = {
	mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	pattern: [0x50, 0x4b, 0x03, 0x04],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.DOCUMENT,
	extensions: ["docx"],
};

export const xlsxMimeType: iMime = {
	mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	pattern: [0x50, 0x4b, 0x03, 0x04],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.DOCUMENT,
	extensions: ["xlsx"],
};

export const pptxMimeType: iMime = {
	mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	pattern: [0x50, 0x4b, 0x03, 0x04],
	mask: [0xff, 0xff, 0xff, 0xff],
	type: eMimeType.DOCUMENT,
	extensions: ["pptx"],
};

/** Plain text with UTF-8 Byte Order Mark (BOM: EF BB BF) */
export const txtUtf8BomMimeType: iMime = {
	mime: "text/plain",
	pattern: [0xef, 0xbb, 0xbf],
	mask: [0xff, 0xff, 0xff],
	type: eMimeType.DOCUMENT,
	extensions: ["txt"],
};

/** Plain text (generic ASCII / UTF-8 without BOM) */
export const txtMimeType: iMime = {
	mime: "text/plain",
	type: eMimeType.DOCUMENT,
	extensions: ["txt"],
};

/** PDF document mime types */
export const pdfDocumentMimeTypes: iMime[] = [pdfMimeType];

/** Legacy Microsoft Office document mime types (.doc, .xls, .ppt) */
export const legacyOfficeDocumentMimeTypes: iMime[] = [docMimeType, xlsMimeType, pptMimeType];

/** Modern Microsoft Office OpenXML document mime types (.docx, .xlsx, .pptx) */
export const openXmlOfficeDocumentMimeTypes: iMime[] = [docxMimeType, xlsxMimeType, pptxMimeType];

/** All Microsoft Office document mime types */
export const officeDocumentMimeTypes: iMime[] = [
	...legacyOfficeDocumentMimeTypes,
	...openXmlOfficeDocumentMimeTypes,
];

/** Plain text document mime types */
export const textDocumentMimeTypes: iMime[] = [txtUtf8BomMimeType, txtMimeType];

/** All supported document mime types */
export const documentMimeTypes: iMime[] = [
	pdfMimeType,
	...officeDocumentMimeTypes,
	...textDocumentMimeTypes,
];
