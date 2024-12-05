import type { iMime } from "@open-xamu-co/ui-common-types";

/**
 * Standard image Mime types array
 * you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
 */
export const standardImageMimeTypes: iMime[] = [
	{
		mime: "image/jpeg",
		pattern: [0xff, 0xd8, 0xff],
		mask: [0xff, 0xff, 0xff],
	},
	{
		mime: "image/png",
		pattern: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
		mask: [0xff, 0xff, 0xff, 0xff],
	},
];

/**
 * Still image mime types array
 */
export const stillImageMimeTypes: iMime[] = [
	...standardImageMimeTypes,
	{
		mime: "image/webp",
		pattern: [
			0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56, 0x50,
		],
		mask: [0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	},
	{
		mime: "image/bmp",
		pattern: [0x42, 0x4d],
		mask: [0xff, 0xff],
	},
	{
		mime: "image/icon",
		pattern: [0x00, 0x00, 0x01, 0x00],
		mask: [0xff, 0xff, 0xff, 0xff],
	},
	{
		mime: "image/icon",
		pattern: [0x00, 0x00, 0x02, 0x00],
		mask: [0xff, 0xff, 0xff, 0xff],
	},
];

/**
 * Moving image mimetypes array
 */
export const gifImageMimeTypes: iMime[] = [
	{
		mime: "image/gif",
		pattern: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
		mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	},
	{
		mime: "image/gif",
		pattern: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
		mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
	},
];

/**
 * All supported image mimetype array
 */
export const imageMimeTypes: iMime[] = [...gifImageMimeTypes, ...stillImageMimeTypes];

/**
 * Check if file matches given mimetype array
 */
export const fileMatchesMimeTypes = (file: File, mimeTypes: iMime[]) => {
	// check if mime and bytes are image type
	const reader = new FileReader();
	const blob = file.slice(0, 4); // read the first 4 bytes of the file;
	const check = (bytes: Uint8Array, mime: iMime) => {
		for (let i = 0, l = mime.mask.length; i < l; ++i) {
			if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
				return false;
			}
		}

		return true;
	};

	return new Promise<boolean>((resolve) => {
		reader.onload = (e) => {
			if (e.target && !e.target.error) {
				const bytes = new Uint8Array(e.target.result as ArrayBuffer);

				for (let i = 0, l = mimeTypes.length; i < l; ++i) {
					if (check(bytes, mimeTypes[i])) {
						// all checks passed
						resolve(true);
					}
				}

				// mime unknown
				resolve(false);
			}
		};
		reader.readAsArrayBuffer(blob);
	});
};

/**
 * Create base64 image string from image file
 */
export const getBase64FromImageFile = (file: File) => {
	//build base64 image string
	const reader = new FileReader();

	return new Promise<string>((resolve) => {
		reader.onload = (e) => {
			resolve(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	});
};

/**
 * Rename any file blob
 */
export const renameFile = (originalFile: File, newName: string) => {
	//rename the given javascript file object
	return new File([originalFile], newName, {
		type: originalFile.type,
		lastModified: originalFile.lastModified,
	});
};
