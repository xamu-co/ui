import { nanoid } from "nanoid";

/**
 * UIID composable
 *
 * TODO: replace uuid with autoincrement from shared state to improve hydration behavior
 *
 * @composable
 */
export default function useUIID() {
	try {
		// this should fail in node
		self.crypto || window.crypto;
	} catch (error) {
		try {
			// inject crypto into the global scope
			global.crypto = global.crypto || require?.("crypto");
		} catch (error) {
			console.log("cannot define crypto");
		}
	}

	return { uuid: nanoid };
}
