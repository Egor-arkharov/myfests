import axios from "axios";
import store from "../index";
import { getDocs } from "firebase/firestore";
import festsCollection from "@/use/fireBaseStore";
import { geoConfig } from "@/use/geoStore";
import { City } from "country-state-city";
import {
	AMOUNT_HEADLINERS,
	AMOUNT_BANDS,
	getMixedBands,
	getLineup,
	getRandomInt,
	shuffle,
} from "@/use/utils";

// localStorage.clear();

export default {
	namespaced: true,
	state() {
		return {
			name: [],
			cities: [],
			img: [],
			genre: JSON.parse(localStorage.getItem("genre")) ?? [],
			freeImg: JSON.parse(localStorage.getItem("freeImg")) ?? [],
		};
	},
	mutations: {
		setImages(state) {
			const IMG_AMOUNT = require
				.context("@/assets/images/fests/", true, /^.*\.jpg$/)
				.keys();

			while (state.img.length !== state.name.length) {
				state.img.push(
					IMG_AMOUNT[getRandomInt(IMG_AMOUNT.length)].slice(0, -4)
				);
				state.img = state.img.filter((el, i, arr) => arr.indexOf(el) === i);
			}

			IMG_AMOUNT.forEach((el) =>
				state.img.includes(el.slice(0, -4))
					? ""
					: state.freeImg.push(el.slice(1, -4))
			);

			localStorage.setItem("freeImg", JSON.stringify(state.freeImg));
		},
		setFests(state) {
			function getRandomDate() {
				const options = { day: "2-digit", month: "2-digit", year: "numeric" };

				const startUnix = new Date().setDate(getRandomInt(300));
				const startDate = new Date(startUnix);
				const startDateString = startDate.toLocaleDateString("ru-RU", options);

				const copyDateStart = new Date(startUnix);

				const endUnix = startDate.setDate(startDate.getDate() + 2);
				const endDate = new Date(endUnix);
				const endDateString = endDate.toLocaleDateString("ru-RU", options);

				return {
					startDateString,
					endDateString,
					copyDateStart,
				};
			}

			function getGenreBands(genre) {
				const genreBands = store.state.bands[genre];
				let randomBands = [];

				while (randomBands.length !== AMOUNT_BANDS) {
					randomBands.push(genreBands[getRandomInt(genreBands.length)]);
					randomBands = randomBands.filter(
						(el, i, arr) => arr.indexOf(el) === i
					);
				}

				return randomBands;
			}

			function getRandomFest(i) {
				const randomDate = getRandomDate();

				const fest = {
					name: state.name[i],
					place: state.cities[i],
					genre:
						i < state.genre.length
							? state.genre[i]
							: state.genre[getRandomInt(state.genre.length)],
					date: {
						start: randomDate.startDateString,
						end: randomDate.endDateString,
						fullDateStart: randomDate.copyDateStart,
					},
					id: Math.random().toString(36).substr(2, 9),
					img: state.img[i].slice(1),
					added: false,
					own: false,
				};

				fest.bands =
					fest.genre !== "Mix"
						? getGenreBands(fest.genre)
						: getMixedBands(state.genre, store.state.bands, AMOUNT_BANDS);

				let headliners = [];

				while (headliners.length !== AMOUNT_HEADLINERS) {
					headliners.push(fest.bands[getRandomInt(fest.bands.length)]);
					headliners = headliners.filter((el, i, arr) => arr.indexOf(el) === i);
				}

				fest.headliners = headliners;
				fest.lineup = getLineup(fest.bands, fest.headliners, store.state.bands);

				return fest;
			}

			for (let i = 0; i < state.name.length; i++) {
				store.state.fests.push(getRandomFest(i));
			}

			shuffle(store.state.fests);

			localStorage.setItem("fests", JSON.stringify(store.state.fests));
		},
	},
	actions: {
		async loadData({ state, dispatch }) {
			try {
				const fireBaseData = await getDocs(festsCollection);

				fireBaseData.docs.forEach((doc) => {
					const data = doc.data();

					state.name = shuffle(data.name);
					state.genre = shuffle(data.genre);
					store.state.bands = data.bands;
				});

				localStorage.setItem("genre", JSON.stringify(state.genre));
				localStorage.setItem("bands", JSON.stringify(store.state.bands));

				dispatch("loadCountries");
			} catch (e) {
				console.log(e.message);
			}
		},
		async loadCountries({ dispatch }) {
			geoConfig.url = "https://api.countrystatecity.in/v1/countries";

			axios(geoConfig)
				.then(function (response) {
					const data = response.data;

					shuffle(data);
					dispatch("loadCities", data);
				})
				.catch(function (error) {
					console.log(error);
				});
		},
		async loadCities({ state, commit }, countries) {
			for (const item of countries) {
				if (state.cities.length === state.name.length) {
					break;
				}

				geoConfig.url = `https://api.countrystatecity.in/v1/countries/${item.iso2}/`;

				await axios(geoConfig)
					.then(function (response) {
						const data = response.data;
						const capital = data.capital;

						const cityData = City.getAllCities().find(
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

			commit("setImages");
			commit("setFests");
		},
	},
	getters: {
		getGenres(state) {
			return state.genre;
		},
		getFreeImg(state) {
			return state.freeImg;
		},
	},
};
