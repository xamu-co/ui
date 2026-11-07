import type { eMimeType } from "@open-xamu-co/ui-common-enums";
import type { iMime } from "@open-xamu-co/ui-common-types";

export * from "./mime/audios";
export * from "./mime/images";
export * from "./mime/videos";

/**
 * Validates whether a given File matches any of the provided MIME signatures
 * by sniffing the file's initial magic bytes (up to 16 bytes).
 *
 * @param file - The HTML File object to inspect.
 * @param mimeTypes - Array of MIME signatures (`iMime`) to validate against.
 * @returns The matching `eMimeType` enum if a signature matches, or `false` if unrecognized or invalid.
 */
export const fileMatchesMimeTypes = (
	file: File,
	mimeTypes: iMime[]
): Promise<eMimeType | false> => {
	if (!file || !mimeTypes?.length) return Promise.resolve(false);

	const reader = new FileReader();
	const blob = file.slice(0, 16); // Read up to the first 16 bytes
	const check = (bytes: Uint8Array, mime: iMime): boolean => {
		const length = Math.min(16, mime.mask.length);

		// File must have at least as many bytes as the pattern requires
		if (bytes.length < length) return false;

		for (let i = 0, l = length; i < l; ++i) {
			if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) return false;
		}

		return true;
	};

	return new Promise<eMimeType | false>((resolve) => {
		reader.onload = (e) => {
			if (e.target && !e.target.error && e.target.result instanceof ArrayBuffer) {
				const bytes = new Uint8Array(e.target.result);

				for (const mime of mimeTypes) {
					// Return matched mime type
					if (check(bytes, mime)) return resolve(mime.type);
				}

				// mime unknown
				resolve(false);
			} else {
				resolve(false);
			}
		};

		reader.onerror = () => resolve(false);
		reader.onabort = () => resolve(false);

		try {
			reader.readAsArrayBuffer(blob);
		} catch {
			resolve(false);
		}
	});
};

/**
 * Creates a renamed copy of a given File object, preserving its original
 * MIME type, blob contents, and lastModified timestamp.
 *
 * @param originalFile - The source File object to rename.
 * @param newName - The new name to assign to the file.
 * @returns A new File instance with the updated name.
 */
export const renameFile = (originalFile: File, newName: string): File => {
	// Rename the given javascript file object
	return new File([originalFile], newName, {
		type: originalFile.type,
		lastModified: originalFile.lastModified,
	});
};
