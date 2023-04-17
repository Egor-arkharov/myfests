export const geoConfig = {
	method: "get",
	headers: {
		"X-CSCAPI-KEY": process.env.COUNTRY_STATE_CITY_KEY,
	},
};
