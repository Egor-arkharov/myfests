export interface DateRange {
	start: string;
	end: string;
	fullDateStart: Date;
}

export interface FestData {
	name: string;
	place: string;
	date: DateRange;
	genre: string;
	bands: string[];
	headliners: string[];
	lineup: object;
	img: string;
	id: string;
	added: boolean;
	own: boolean;
}

export interface festState {
	fests: FestData[];
}

export interface ServerData {
	names: string[];
	cities: string[];
	genres: string[];
	bands: { [key: string]: string[] };
}

export interface imgData {
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

export interface auth {
	isLoggedIn: any;
	nick: string | null;
}
