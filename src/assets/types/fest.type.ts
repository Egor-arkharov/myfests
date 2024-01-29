export interface DateRange {
	start: string;
	end: string;
	fullDateStart: string;
}

export interface FestData {
	name: string;
	place: any;
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
	getters(arg0: string): any;
	fests: FestData[];
	generatingFests: Boolean;
	stopGeneration: Boolean;
	festsReseted: Boolean;
	generatedFestsCount: number;
	generatingFestsTotal: number;
	looping: Boolean;
}

export interface ServerData {
	names: string[];
	countries: string;
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
	firstTimeAuth: Boolean;
	nick: string | null;
	user: any;
}
