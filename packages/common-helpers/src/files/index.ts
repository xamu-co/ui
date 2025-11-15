import type { iMime } from "@open-xamu-co/ui-common-types";

export * from "./images";

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
 * Rename any file blob
 */
export const renameFile = (originalFile: File, newName: string) => {
	//rename the given javascript file object
	return new File([originalFile], newName, {
		type: originalFile.type,
		lastModified: originalFile.lastModified,
	});
};
