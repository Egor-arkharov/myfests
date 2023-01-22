import { createStore, createLogger } from "vuex";
import loader from "@/use/googleMapsStore";
import load from "./modules/load.module";

const plugins = [];

if (process.env.NODE_ENV === "development") {
	plugins.push(createLogger());
}

const getRandomInt = (max) => Math.floor(Math.random() * max);

export default createStore({
	plugins,
	state() {
		return {
			fests: JSON.parse(localStorage.getItem("fests")) ?? [],
			bands: JSON.parse(localStorage.getItem("bands")) ?? [],
			myfests: [],
		};
	},
	mutations: {
		addFest(state, data) {
			const fest = {
				name: data.name,
				place: data.place,
				genre: data.genre,
				headliners: data.headliners,
				bands: data.bands,
				date: {
					start: data.date[0],
					end: data.date[1],
					fullDateStart: new Date(
						data.date[0].replace(/(\d\d).(\d\d)/, "$2.$1")
					),
				},
				id: Math.random().toString(36).substr(2, 9),
				added: false,
			};

			state.fests.push(fest);
		},
		addMyFest(state, data) {
			const index = state.myfests.findIndex((item) => item === data);

			index !== -1 ? state.myfests.splice(index, 1) : state.myfests.push(data);
		},
		sortFests(state, sortSettings) {
			/* eslint-disable prettier/prettier */
			switch (sortSettings.sortType) {
			case "genre":
				sortSettings.isSorted
					? state.fests.sort((a, b) => (a.genre > b.genre ? 1 : -1))
					: state.fests.sort((a, b) => (a.genre < b.genre ? 1 : -1));
				break;
			case "date":
				sortSettings.isSorted
					? state.fests.sort((a, b) => (a.date.fullDateStart > b.date.fullDateStart ? 1 : -1))
					: state.fests.sort((a, b) => (a.date.fullDateStart < b.date.fullDateStart ? 1 : -1));
				break
			}
		},
	},
	actions: {
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
		getBandsByGenre: (state, rootGetters) => (genre) => {
			const allGenres = rootGetters['load/getGenres']

			let bands = null;

			function getMixedBands() {
				let mixedBands = [];

				const genresWithoutMix = allGenres.filter((el) => el !== "Mix");

				while (mixedBands.length !== 10) {
					let randomGenre =
						genresWithoutMix[getRandomInt(genresWithoutMix.length)];

					let bandsFromRandomGenre = state.bands[randomGenre];

					let randomBand =
						bandsFromRandomGenre[getRandomInt(bandsFromRandomGenre.length)];

					mixedBands.push(randomBand);

					mixedBands = mixedBands.filter((el, i, arr) => arr.indexOf(el) === i);
				}

				return mixedBands;
			}

			bands = (genre !== "Mix") ? state.bands[genre] : getMixedBands();

			return bands;
		},
		getMyFests(state) {
			return state.myfests;
		},
	},
	modules: {
		load,
	}
});
