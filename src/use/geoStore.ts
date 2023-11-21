interface geoConfigInterFace {
	method: string;
	headers: any;
	url?: string;
}

export const geoConfig: geoConfigInterFace = {
	method: "get",
	headers: {
		"X-CSCAPI-KEY": process.env.COUNTRY_STATE_CITY_KEY,
	},
};
