import axios from "axios";
import store from "../index";
import { getDocs } from "firebase/firestore";
import festsCollection from "@/use/fireBaseStore";
import { geoConfig } from "@/use/geoStore";
import { City } from "country-state-city";

const IMG_AMOUNT = require
	.context("@/assets/images/", true, /^.*\.jpg$/)
	.keys();

const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
};

// localStorage.clear();

const getRandomInt = (max) => Math.floor(Math.random() * max);

export default {
	namespaced: true,
	state() {
		return {
			name: [],
			genre: [],
			cities: [],
		};
	},
	mutations: {
		setFests(state) {
			function getMixedBands() {
				let mixedBands = [];

				const genresWithoutMix = state.genre.filter((el) => el !== "Mix");

				while (mixedBands.length !== 10) {
					let randomGenre =
						genresWithoutMix[getRandomInt(genresWithoutMix.length)];

					let bandsFromRandomGenre = store.state.bands[randomGenre];

					let randomBand =
						bandsFromRandomGenre[getRandomInt(bandsFromRandomGenre.length)];

					mixedBands.push(randomBand);

					mixedBands = mixedBands.filter((el, i, arr) => arr.indexOf(el) === i);
				}

				return mixedBands;
			}

			function getRandomDate() {
				const randomDateStart = new Date().setDate(getRandomInt(300));

				let copyDateStart = new Date(randomDateStart);
				copyDateStart.setDate(copyDateStart.getDate() + 2);

				const dateStart = new Date(randomDateStart).toLocaleDateString();
				const dateEnd = copyDateStart.toLocaleDateString();

				return {
					dateStart,
					dateEnd,
				};
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
						start: randomDate.dateStart,
						end: randomDate.dateEnd,
						fullDateStart: new Date(
							randomDate.dateStart.replace(/(\d\d).(\d\d)/, "$2.$1")
						),
					},
					id: Math.random().toString(36).substr(2, 9),
					img: IMG_AMOUNT[getRandomInt(IMG_AMOUNT.length)].slice(1),
					added: false,
				};

				fest.bands =
					fest.genre !== "Mix"
						? store.state.bands[fest.genre]
						: getMixedBands();

				let headliners = [];

				while (headliners.length !== 3) {
					headliners.push(fest.bands[getRandomInt(fest.bands.length)]);
					headliners = headliners.filter((el, i, arr) => arr.indexOf(el) === i);
				}

				fest.headliners = headliners;

				return fest;
			}

			for (let i = 0; i < state.name.length; i++) {
				store.state.fests.push(getRandomFest(i));
			}

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

			commit("setFests");
		},
	},
	getters: {
		getGenres(state) {
			return state.genre;
		},
	},
};
