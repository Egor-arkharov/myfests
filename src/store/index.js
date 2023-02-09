import { createStore, createLogger } from "vuex";
import loader from "@/use/googleMapsStore";
import load from "./modules/load.module";
import { getMixedBands, AMOUNT_BANDS_MAX, getLineup } from "@/use/utils";

const plugins = [];

if (process.env.NODE_ENV === "development") {
	plugins.push(createLogger());
}

export default createStore({
	plugins,
	state() {
		return {
			fests: JSON.parse(localStorage.getItem("fests")) ?? [],
			bands: JSON.parse(localStorage.getItem("bands")) ?? [],
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
				own: true,
				img: data.img,
				lineup: getLineup(data.bands, data.headliners),
			};

			state.fests.push(fest);
			localStorage["fests"] = JSON.stringify(state.fests);
		},
		changeMyFests(state, data) {
			const fest = state.fests.find((el) => el === data);
			fest.added = !fest.added;

			localStorage["fests"] = JSON.stringify(state.fests);
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
				lat: +payload.place.latitude,
				lng: +payload.place.longitude,
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
						document.getElementById(`map-${payload.name}`),
						mapOptions
					);

					new google.maps.Marker({
						position: myLatLng,
						map,
						title: payload.place.name,
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

			return (genre !== "Mix") ? state.bands[genre] : getMixedBands(allGenres, state.bands, AMOUNT_BANDS_MAX);
		},
		getMyFests(state, getters) {
			return getters.getFests.filter((f) => f.added === true);
		},
	},
	modules: {
		load,
	}
});
