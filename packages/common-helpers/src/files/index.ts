import type { eMimeType } from "@open-xamu-co/ui-common-enums";
import type { iMime } from "@open-xamu-co/ui-common-types";

export * from "./images";

/**
 * Check if file matches given mimetype array
 */
export const fileMatchesMimeTypes = (file: File, mimeTypes: iMime[]) => {
	// check if mime and bytes are image type
	const reader = new FileReader();
	const blob = file.slice(0, 12); // Read the first 12 bytes of the file
	const check = (bytes: Uint8Array, mime: iMime) => {
		// Allowed maximum of 12
		const length = Math.min(12, mime.mask.length);

		for (let i = 0, l = length; i < l; ++i) {
			if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) return false;
		}

		return true;
	};

	return new Promise<eMimeType | false>((resolve) => {
		reader.onload = (e) => {
			if (e.target && !e.target.error) {
				const bytes = new Uint8Array(e.target.result as ArrayBuffer);

				for (const mime of mimeTypes) {
					// Return matched mime type
					if (check(bytes, mime)) return resolve(mime.type);
				}

				// mime unknown
				resolve(false);
			}
		};
		reader.readAsArrayBuffer(blob);
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
