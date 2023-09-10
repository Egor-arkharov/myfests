export interface DateRange {
	start: string;
	end: string;
	fullDateStart: Date;
}

export interface Fest {
	name: string;
	place: string;
	genre: string;
	date: DateRange;
	id: string;
	added: boolean;
	own: boolean;
	img: string;
	headliners?: string[];
	bands?: string[];
	lineup?: object;
}

export interface ServerData {
	names: string[];
	cities: string[];
	genres: string[];
	bands: { [key: string]: string[] };
}

export interface imgInt {
	reservedImg: string[];
	freeImg: any[];
}

export interface siteSettings {
	titleAnimate: Boolean;
	warnModal: Boolean;
	sidebar: Boolean;
	mainView: string;
	breakpoints: { [key: string]: number };
}

export interface festState {
	fests: Fest[];
}
