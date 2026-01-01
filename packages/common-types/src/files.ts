import type { eMimeType } from "@open-xamu-co/ui-common-enums";

export interface iMime {
	mime: string;
	pattern: number[];
	mask: number[];
	type: eMimeType;
}
