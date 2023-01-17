import axios from "axios";
import store from "../index";
import { getDocs } from "firebase/firestore";
import festsCollection from "@/use/fireBaseStore";
import { City } from "country-state-city";

localStorage.clear();

const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
};

const getRandomInt = (max) => Math.floor(Math.random() * max);

export default {
	namespaced: true,
	mutations: {
		setFests(_, data) {
			function randomGenre() {
				let genre = null;

				for (let i = 0; i < data.genre.length; i++) {
					const item = data.genre[i];
					const isStateHasGenre = store.state.fests.find(
						(fest) => fest.genre === item
					);

					if (isStateHasGenre) {
						genre = data.genre[getRandomInt(data.genre.length)];
					} else {
						genre = item;
						break;
					}
				}

				return genre;
			}

			function randomFestFromData(i) {
				const randomDateStart = new Date().setDate(getRandomInt(300));

				let copyDateStart = new Date(randomDateStart);
				copyDateStart.setDate(copyDateStart.getDate() + 2);

				const dateStart = new Date(randomDateStart).toLocaleDateString();
				const dateEnd = copyDateStart.toLocaleDateString();

				const fest = {
					name: data.name[i],
					place: store.state.cities[i],
					genre: randomGenre(),
					date: {
						start: dateStart,
						end: dateEnd,
						fullDateStart: new Date(
							dateStart.replace(/(\d\d).(\d\d)/, "$2.$1")
						),
					},
					id: Math.random().toString(36).substr(2, 9),
					added: false,
				};

				fest.bands = store.state.bands[fest.genre];

				let headliners = [];

				while (headliners.length !== 3) {
					headliners.push(fest.bands[getRandomInt(fest.bands.length)]);
					headliners = headliners.filter((el, i, arr) => arr.indexOf(el) === i);
				}

				fest.headliners = headliners;

				return fest;
			}

			for (let i = 0; i < data.name.length; i++) {
				store.state.fests.push(randomFestFromData(i));
			}

			localStorage.setItem("fests", JSON.stringify(store.state.fests));
		},
		setBands(_, data) {
			store.state.bands = data.bands;

			let allBands = [];

			function setBandsInMix() {
				const genresWithoutMix = data.genre.filter((el) => el !== "Mix");

				while (allBands.length !== 10) {
					let randomGenre =
						genresWithoutMix[getRandomInt(genresWithoutMix.length)];

					let bandsFromRandomGenre = data.bands[randomGenre];

					let randomBand =
						bandsFromRandomGenre[getRandomInt(bandsFromRandomGenre.length)];

					allBands.push(randomBand);

					allBands = allBands.filter((el, i, arr) => arr.indexOf(el) === i);
				}
			}

			setBandsInMix();

			store.state.bands["Mix"] = allBands;
			localStorage.setItem("bands", JSON.stringify(store.state.bands));
		},
		setCities(_, data) {
			store.state.cities = data;
			localStorage.setItem("cities", JSON.stringify(store.state.cities));
		},
	},
	actions: {
		async loadFests({ commit }) {
			try {
				const fireBaseData = await getDocs(festsCollection);

				fireBaseData.docs.forEach((doc) => {
					const data = doc.data();

					shuffle(data.name);
					shuffle(data.place);
					shuffle(data.genre);

					commit("setBands", data);
					commit("setFests", data);
				});
			} catch (e) {
				console.log(e.message);
			}
		},
		async loadData({ commit, dispatch }) {
			const COUNTRY_STATE_CITY_KEY =
				"MUJDaWx3SXNpVWNRWHczR1dDa0pGUzZjYzJCTTJUdmJzR2RGTFh5NA==";

			const config = {
				method: "get",
				headers: {
					"X-CSCAPI-KEY": COUNTRY_STATE_CITY_KEY,
				},
			};

			config.url = "https://api.countrystatecity.in/v1/countries";

			let randomCities = [];

			axios(config)
				.then(function (response) {
					const data = response.data;
					shuffle(data);
					findCities(data);
				})
				.catch(function (error) {
					console.log(error);
				});

			async function findCities(slicedCountries) {
				for (const item of slicedCountries) {
					if (randomCities.length === 8) {
						break;
					}

					config.url = `https://api.countrystatecity.in/v1/countries/${item.iso2}/`;

					await axios(config)
						.then(function (response) {
							const data = response.data;
							const capital = data.capital;

							const cityData = City.getAllCities().find(
								(item) => item.name === capital
							);

							if (capital && cityData) {
								cityData.countryName = data.name;
								randomCities.push(cityData);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				}

				commit("setCities", randomCities);
				dispatch("loadFests");
			}
		},
	},
};
