import { createStore, createLogger } from "vuex";
import { getDocs } from "firebase/firestore";
import festsCollection from "@/use/fireBaseStore";
import axios from "axios";
import { City } from "country-state-city";
import loader from "@/use/googleMapsStore";

const plugins = [];

if (process.env.NODE_ENV === "development") {
	plugins.push(createLogger());
}

const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
};

const getRandomInt = (max) => Math.floor(Math.random() * max);

export default createStore({
	plugins,
	state() {
		return {
			fests: [],
			bands: [],
			cities: [],
		};
	},
	mutations: {
		setFests(state, data) {
			function randomFestFromData(i) {
				const randomDateStart = new Date().setDate(getRandomInt(300));

				let copyDateStart = new Date(randomDateStart);
				copyDateStart.setDate(copyDateStart.getDate() + 2);

				const dateStart = new Date(randomDateStart).toLocaleDateString();
				const dateEnd = copyDateStart.toLocaleDateString();

				const fest = {
					name: data.name[i],
					place: state.cities[i],
					genre: data.genre[getRandomInt(data.genre.length)],
					date: dateStart + "-" + dateEnd,
					id: Math.random().toString(36).substr(2, 9),
				};

				fest.bands = state.bands[fest.genre];

				let headliners = [];

				while (headliners.length !== 3) {
					headliners.push(fest.bands[getRandomInt(fest.bands.length)]);
					headliners = headliners.filter((el, i, arr) => arr.indexOf(el) === i);
				}

				fest.headliners = headliners;

				return fest;
			}

			for (let i = 0; i < data.name.length; i++) {
				state.fests.push(randomFestFromData(i));
			}
		},
		addFest(state, data) {
			const fest = {
				name: data.name,
				place: data.place,
				genre: data.genre,
				headliners: data.headliners,
				bands: data.bands,
				date: data.date[0] + "-" + data.date[1],
				id: Math.random().toString(36).substr(2, 9),
			};

			state.fests.push(fest);
		},
		setBands(state, data) {
			state.bands = data.bands;

			let allBands = [];

			function setBandsInAll() {
				const genresWithoutAll = data.genre.filter((el) => el !== "All");

				while (allBands.length !== 10) {
					let randomGenre =
						genresWithoutAll[getRandomInt(genresWithoutAll.length)];

					let bandsFromRandomGenre = data.bands[randomGenre];

					let randomBand =
						bandsFromRandomGenre[getRandomInt(bandsFromRandomGenre.length)];

					allBands.push(randomBand);

					allBands = allBands.filter((el, i, arr) => arr.indexOf(el) === i);
				}
			}

			setBandsInAll();

			state.bands["All"] = allBands;
		},
		setCities(state, data) {
			state.cities = data;
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

					commit("setBands", data);
					commit("setFests", data);
				});
			} catch (e) {
				console.log(e.message);
			}
		},
		createFest({ commit }, payload) {
			commit("addFest", payload);
		},
		async loadCities({ commit, dispatch }) {
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
		async loadMap(_, payload) {
			const myLatLng = {
				lat: +payload.value.place.latitude,
				lng: +payload.value.place.longitude,
			};

			const mapOptions = {
				center: myLatLng,
				zoom: 8,
				requestedLanguage: "en",
			};

			await loader
				.load()
				.then((google) => {
					const map = new google.maps.Map(
						document.getElementById("map"),
						mapOptions
					);

					new google.maps.Marker({
						position: myLatLng,
						map,
						title: payload.value.place.name,
					});
				})
				.catch((e) => {
					console.log(e);
				});
		},
	},
	getters: {
		getFests(state) {
			return state.fests;
		},
		getFestsById(_, getters) {
			return (id) => getters.getFests.find((t) => t.id === id);
		},
		getBandsByGenre: (state) => (genre) => {
			return state.bands[genre];
		},
	},
});
