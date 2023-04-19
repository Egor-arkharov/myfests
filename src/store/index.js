import { createStore, createLogger } from "vuex";
import loader from "@/use/googleMapsStore";
import start from "./modules/start.module";
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
			titleAnimate: JSON.parse(sessionStorage.getItem("titleAnimate")) ?? true,
			warnModal: JSON.parse(sessionStorage.getItem("warnModal")) ?? false,
			sidebar: false,
			breakpoints: {
				xs: 600,
				sm: 798,
				md: 1080,
				lg: 1280,
				xl: 1500,
			},
			mainView: JSON.parse(localStorage.getItem("mainView")) ?? "table",
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
				date: data.date,
				id: Math.random().toString(36).substr(2, 9),
				added: false,
				own: true,
				img: data.img,
				lineup: getLineup(data.bands, data.headliners, state.bands),
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
		animateTitle(state) {
			setTimeout(() => {
				state.titleAnimate = false;
			}, 0);

			sessionStorage.setItem("titleAnimate", false);
		},
		removeWarnModal(state) {
			state.warnModal = true;
			sessionStorage.setItem("warnModal", true);
		},
		openSidebar(state) {
			state.sidebar = true;
			document.body.classList.add("body--sidebar");
		},
		closeSidebar(state) {
			state.sidebar = false;
			document.body.classList.add("body--sidebar-close");
			
			setTimeout(() => {
				document.body.classList.remove(
					"body--sidebar", 
					"body--sidebar-close"
				)
			}, 1000);
		},
		changeMainView(state, type) {
			state.mainView = type;
			localStorage.setItem("mainView", JSON.stringify(type));
		}
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
		clearAllData({ state, dispatch }) {
			localStorage.clear();

			state.bands = [];
			state.fests = [];
			state.myfests = [];

			state.start.cities = [];
			state.start.img = [];
			state.start.name = [];
			state.start.genre = [];
			state.start.freeImg = [];

			(async () => await dispatch('start/loadData', null, {root:true}))();
		}
	},
	getters: {
		getFests(state) {
			return state.fests;
		},
		getFestsById(_, getters) {
			return (id) => getters.getFests.find((t) => t.id === id);
		},
		getBandsByGenre: (state, rootGetters) => (genre) => {
			const allGenres = rootGetters['start/getGenres']

			return (genre !== "Mix") ? state.bands[genre] : getMixedBands(allGenres, state.bands, AMOUNT_BANDS_MAX);
		},
		getMyFests(state, getters) {
			return getters.getFests.filter((f) => f.added === true);
		},
		getTitleAnimate(state) {
			return state.titleAnimate
		},
		getWarnModal(state) {
			return state.warnModal
		},
		getMobileView(state) {
			return window.innerWidth < state.breakpoints.xs
		},
		getDesktopView(state) {
			return window.innerWidth >= state.breakpoints.xl
		},
		getMainView(state) {
			return state.mainView
		}
	},
	modules: {
		start,
	}
});
