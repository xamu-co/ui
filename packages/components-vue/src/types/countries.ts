export interface iCity {
	name: string;
}

export interface iState {
	name: string;
	code: string;
}

export interface iCountry {
	name: string;
	indicative: `+${number}`;
	code: string;
}
