import axios from "axios";
import { getDocs } from "firebase/firestore";
import festsCollection from "@/use/fireBaseStore";
import { geoConfig } from "@/use/geoStore";
import { City } from "country-state-city";
import { shuffle, AMOUNT_BANDS_MAX, getMixedBands } from "@/use/utils";
import { ServerData } from "@/assets/types/fest.type";

const state: ServerData = {
	names: JSON.parse(localStorage.getItem("store") || "[]")?.server?.names ?? [],
	genres:
		JSON.parse(localStorage.getItem("store") || "[]")?.server?.genres ?? [],
	bands: JSON.parse(localStorage.getItem("store") || "{}")?.server?.bands ?? {},
	cities:
		JSON.parse(localStorage.getItem("store") || "[]")?.server?.cities ?? [],
};

const mutations = {
	setNames(state: ServerData, names: ServerData["names"]) {
		state.names = names;
	},
	setGenre(state: ServerData, genres: ServerData["genres"]) {
		state.genres = genres;
	},
	setBands(state: ServerData, bands: ServerData["bands"]) {
		state.bands = bands;
	},
	setCities(state: ServerData, cities: ServerData["cities"]) {
		state.cities = cities;
	},
};

const actions = {
	async loadFireBaseData({ commit }: { commit: Function }) {
		try {
			const ServerData = await getDocs(festsCollection);

			ServerData.docs.forEach((doc) => {
				const data = doc.data();
				commit("setNames", shuffle(data.name));
				commit("setGenre", shuffle(data.genre));
				commit("setBands", data.bands);
			});
		} catch (e: any) {
			console.log(e.message);
		}
	},
	async loadGeoData({ dispatch }: { dispatch: any }) {
		const countries = await dispatch("loadCountries");

		await dispatch("loadCities", countries);
	},
	async loadCountries() {
		geoConfig.url = "https://api.countrystatecity.in/v1/countries";

		try {
			const response = await axios(geoConfig);
			const data = response.data;

			shuffle(data);

			return data;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
	async loadCities({ state }: { state: ServerData }, countries: any) {
		for (const item of countries) {
			if (state.cities.length === state.names.length) {
				break;
			}

			geoConfig.url = `https://api.countrystatecity.in/v1/countries/${item.iso2}/`;

			await axios(geoConfig)
				.then(function (response) {
					const data = response.data;
					const capital = data.capital;

					const cityData: any = City.getAllCities().find(
						(item) => item.name === capital
					);

					if (capital && cityData) {
						cityData.countryName = data.name;
						state.cities.push(cityData);
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		}
	},
};

const getters = {
	getNames: (state: ServerData) => state.names,
	getGenres: (state: ServerData) => state.genres,
	getBands: (state: ServerData) => state.bands,
	getCities: (state: ServerData) => state.cities,
	getBandsByGenre: (state: ServerData, getters: any) => (genre: any) => {
		const allGenres = getters.getGenres;

		return genre !== "Mix"
			? state.bands[genre]
			: getMixedBands(allGenres, state.bands, AMOUNT_BANDS_MAX);
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
