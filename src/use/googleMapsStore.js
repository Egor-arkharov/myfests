import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
	apiKey: "AIzaSyBaMh2B_eiVfBw1mb8dEvZ4YWUHHixP4c8",
	version: "weekly",
	libraries: ["places"],
});

export default loader;
