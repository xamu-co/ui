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
 * @export
 * @param {string} str a normal string
 */
export function srtToClipboard(str: string) {
	/** Fallback - copy the given string to the user clipboard */
	function oldStrToClipboard(str: string) {
		const el = document.createElement("textarea");

		el.value = str;
		document.body.appendChild(el);
		el.select();
		document.execCommand("copy");
		document.body.removeChild(el);
	}

	return new Promise<boolean>((resolve) => {
		if ("clipboard" in navigator) {
			navigator.clipboard
				.writeText(str)
				.then(() => {
					// Copiado moderno
					resolve(true);
				})
				.catch((error) => {
					// This can happen if the user denies clipboard permissions:
					// eslint-disable-next-line no-console
					console.log("Could not copy text", error);
					// reject(new Error("Could not copy text"));
					resolve(false);
				});
		} else if (oldStrToClipboard(str) !== null) {
			// Copiado con fallback
			resolve(true);
		}
	});
}

/**
 * Share content using the share api
 * Fallsback to clipboard copy
 *
 * @export
 * @param {string} title A short title
 * @param {string} text A good description
 * @param {string} url Valid web url
 */
export function shareThis(title: string, text: string, url: string) {
	return new Promise<boolean>((resolve) => {
		if ("share" in navigator) {
			// share using api
			navigator
				.share({
					title,
					text,
					url,
				})
				.then(() => {
					// eslint-disable-next-line no-console
					console.log("Successful share");
					resolve(true);
				})
				.catch((error) => {
					// eslint-disable-next-line no-console
					console.log("Error sharing or cancelled", error);
					resolve(false);
				});
		} else {
			// copiar url al clipboard
			resolve(srtToClipboard(url));
		}
	});
}
