/**
 * Strips unsafe html
 *
 * @param {string} s
 * @returns {string}
 */
export function stripScripts(s: string) {
	const div = document.createElement("div");

	div.innerHTML = s;

	const scripts = div.getElementsByTagName("script");
	let i = scripts.length;

	while (i--) {
		const parent = scripts[i].parentNode;

		if (parent) parent.removeChild(scripts[i]);
	}

	return div.innerHTML;
}

/**
 * Scroll page to given element
 *
 * @export
 * @param {string} section Id del elemento
 */
export function scrollTo(section: string) {
	if (section === "#" || section === "") {
		window.scrollTo({ top: 0, behavior: "smooth" });
	} else {
		const element = document.getElementById(section.replace(/#/gi, ""));

		if (!element) return;

		const position = window.scrollY + element.getBoundingClientRect().top - 80;

		if (position !== 0) {
			window.scrollTo({ top: position, behavior: "smooth" });
		}
	}
}

/**
 * Copy the given string to the user clipboard
 * This uses the more modern clipboard api, but using the previos function as a fallback
 *
 * @param {string} str a normal string
 */
export async function srtToClipboard(str: string): Promise<boolean> {
	/** Fallback - copy the given string to the user clipboard */
	function oldStrToClipboard(str: string) {
		const el = document.createElement("textarea");

		el.value = str;
		document.body.appendChild(el);
		el.select();
		document.execCommand("copy");
		document.body.removeChild(el);
	}

	if ("clipboard" in navigator) {
		try {
			await navigator.clipboard.writeText(str);

			// Copiado moderno
			return true;
		} catch (err) {
			// This can happen if the user denies clipboard permissions:
			// eslint-disable-next-line no-console
			console.log("Could not copy text", err);

			// reject(new Error("Could not copy text"));
			return false;
		}
	} else if (oldStrToClipboard(str) !== null) {
		// Copiado con fallback
		return true;
	}

	return false;
}

/**
 * Share content using the share api
 * Fallsback to clipboard copy
 *
 * @param {string} title A short title
 * @param {string} text A good description
 * @param {string} url Valid web url
 */
export async function shareThis(title: string, text: string, url: string): Promise<boolean> {
	if ("share" in navigator) {
		try {
			// share using api
			await navigator.share({ title, text, url });

			// eslint-disable-next-line no-console
			console.log("Successful share");

			return true;
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log("Error sharing or cancelled", err);

			return false;
		}
	} else {
		// copiar url al clipboard
		return srtToClipboard(url);
	}

	return false;
}
