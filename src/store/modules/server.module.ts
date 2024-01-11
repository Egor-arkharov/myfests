import store from "../index";
import axios from "axios";
import { getDocs } from "firebase/firestore";
import festsCollection from "@/use/fireBaseStore";
import { geoConfig } from "@/use/geoStore";
import { City } from "country-state-city";
import {
	shuffle,
	AMOUNT_BANDS_MAX,
	getMixedBands,
	getRandomInt,
} from "@/use/utils";
import { ServerData } from "@/assets/types/fest.type";

const state: ServerData = {
	names: JSON.parse(localStorage.getItem("server") || "[]")?.names ?? [],
	genres: JSON.parse(localStorage.getItem("server") || "[]")?.genres ?? [],
	bands: JSON.parse(localStorage.getItem("server") || "{}")?.bands ?? {},
	countries: JSON.parse(sessionStorage.getItem("countries") || "[]") ?? "",
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
	setCountries(state: ServerData, countries: ServerData["countries"]) {
		state.countries = countries;
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
	async loadCountries({ commit }: { commit: Function }) {
		geoConfig.url = "https://api.countrystatecity.in/v1/countries";

		try {
			const response = await axios(geoConfig);
			const data = response.data;

			commit("setCountries", data);
			sessionStorage.setItem("countries", JSON.stringify(data));

			return data;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
	async loadCities({ dispatch }: { dispatch: any }, countries: any[]) {
		const randomCountryIndex = getRandomInt(countries.length);
		const randomCountry = countries[randomCountryIndex];
		// const randomCountry = countries[getRandomInt(countries.length)];

		const fests = store.getters["fest/getFests"];

		if (
			fests.some(
				(fest: any) => fest.place.countryName === randomCountry.countryName
			)
		) {
			console.log("ТАКОЙ ФЕСТ УЖЕ ЕСТЬ, УДАЛЯЕМ");

			countries.splice(randomCountryIndex, 1);
			sessionStorage.setItem("countries", JSON.stringify(countries));

			return dispatch("loadCities", countries);
		}

		geoConfig.url = `https://api.countrystatecity.in/v1/countries/${randomCountry.iso2}/`;

		try {
			const response = await axios(geoConfig);
			const data = response.data;
			const capital = data.capital;

			const cityData: any = City.getAllCities().find(
				(item) => item.name === capital
			);

			if (capital && cityData) {
				cityData.countryName = data.name;

				countries.splice(randomCountryIndex, 1);

				return cityData;
			} else {
				console.error(
					"NO CITYDATA OR CAPITAL",
					randomCountry,
					cityData,
					capital
				);

				countries.splice(randomCountryIndex, 1);

				sessionStorage.setItem("countries", JSON.stringify(countries));

				return dispatch("loadCities", countries);
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};

const getters = {
	getNames: (state: ServerData) => state.names,
	getGenres: (state: ServerData) => state.genres,
	getBands: (state: ServerData) => state.bands,
	getCountries: (state: ServerData) => state.countries,
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
