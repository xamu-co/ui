import { nanoid } from "nanoid";

/**
 * UIID composable
 *
 * @composable
 */
export default function useUIID() {
	try {
		// this should fail in node
		self.crypto || window.crypto;
	} catch (error) {
		// inject crypto into the global scope
		global.crypto = global.crypto || require("crypto");
	}

	return { uuid: nanoid };
}
