import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
	apiKey: process.env.GOOGLE_APIKEY,
	version: "weekly",
	libraries: ["places"],
	language: "en",
});

export default loader;
