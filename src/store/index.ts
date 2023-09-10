import { createStore, createLogger } from "vuex";
import loader from "@/use/googleMapsStore";
import server from "./modules/server.module";
import img from "./modules/img.module";
import settings from "./modules/settings.module";
import { Fest, festState, DateRange } from "@/assets/types/fest.type";
import {
	AMOUNT_HEADLINERS,
	AMOUNT_BANDS,
	getMixedBands,
	getLineup,
	getRandomInt,
	shuffle,
} from "@/use/utils";

const plugins = [];

if (process.env.NODE_ENV === "development") {
	plugins.push(createLogger());
}

const state: festState = {
	fests: JSON.parse(localStorage.getItem("store") || "[]")?.fests ?? [],
};

export default createStore({
	plugins,
	state,
	mutations: {
		addFest(state, data) {
			const allBands = server.getters.getBands;
			console.log(allBands);

			const fest: Fest = {
				name: data.name,
				place: data.place,
				genre: data.genre,
				headliners: data.headliners,
				bands: data.bands.concat(data.headliners),
				date: data.date,
				id: Math.random().toString(36).substr(2, 9),
				added: false,
				own: true,
				img: data.img,
				lineup: getLineup(data.bands, data.headliners, allBands),
			};

			state.fests.push(fest);

			const localStorageData = JSON.parse(
				localStorage.getItem("store") || "{}"
			);
			localStorageData.fests = state.fests;
			const updatedDataString = JSON.stringify(localStorageData);
			localStorage.setItem("store", updatedDataString);
		},
		changeMyFests(state, data) {
			const fest = state.fests.find((el: Fest) => el === data);

			if (fest) {
				fest.added = !fest.added;
				localStorage["store"].fests = JSON.stringify(state.fests);
			}
		},
		sortFests(state, sortSettings) {
			console.log(server.getters.getBands(server.state));

			switch (sortSettings.sortType) {
				case "genre":
					sortSettings.isSorted
						? state.fests.sort((a: any, b: any) => (a.genre > b.genre ? 1 : -1))
						: state.fests.sort((a: any, b: any) =>
								a.genre < b.genre ? 1 : -1
						  );
					break;
				case "date":
					sortSettings.isSorted
						? state.fests.sort((a: any, b: any) =>
								a.date.fullDateStart > b.date.fullDateStart ? 1 : -1
						  )
						: state.fests.sort((a: any, b: any) =>
								a.date.fullDateStart < b.date.fullDateStart ? 1 : -1
						  );
					break;
			}
		},
		setFests(state) {
			function getRandomDate(): DateRange {
				const options: Intl.DateTimeFormatOptions = {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				};

				const startUnix = new Date().setDate(getRandomInt(300));
				const startDate = new Date(startUnix);
				const startDateString = startDate.toLocaleDateString("ru-RU", options);

				const copyDateStart = new Date(startUnix);

				const endUnix = startDate.setDate(startDate.getDate() + 2);
				const endDate = new Date(endUnix);
				const endDateString = endDate.toLocaleDateString("ru-RU", options);

				return {
					start: startDateString,
					end: endDateString,
					fullDateStart: copyDateStart,
				};
			}

			function getGenreBands(genre: string) {
				const genreBands = server.getters.getBands(server.state)[genre];
				let randomBands: string[] = [];

				while (randomBands.length !== AMOUNT_BANDS) {
					randomBands.push(genreBands[getRandomInt(genreBands.length)]);
					randomBands = randomBands.filter(
						(el, i, arr) => arr.indexOf(el) === i
					);
				}

				return randomBands;
			}

			function getRandomFest(i: number) {
				const randomDate = getRandomDate();

				const fest: Fest = {
					name: server.getters.getNames(server.state)[i],
					place: server.getters.getCities(server.state)[i],
					genre:
						i < server.getters.getGenres(server.state).length
							? server.getters.getGenres(server.state)[i]
							: server.getters.getGenres(server.state)[
									getRandomInt(server.getters.getGenres(server.state).length)
							  ],
					date: {
						start: randomDate.start,
						end: randomDate.end,
						fullDateStart: randomDate.fullDateStart,
					},
					id: Math.random().toString(36).substr(2, 9),
					img: img.getters.getReservedImg(img.state)[i].slice(1),
					added: false,
					own: false,
				};

				fest.bands =
					fest.genre !== "Mix"
						? getGenreBands(fest.genre)
						: getMixedBands(
								server.getters.getGenres(server.state),
								server.getters.getBands(server.state),
								AMOUNT_BANDS
						  );

				let headliners: Fest["headliners"] = [];

				while (headliners.length !== AMOUNT_HEADLINERS) {
					headliners.push(fest.bands[getRandomInt(fest.bands.length)]);
					headliners = headliners.filter((el, i, arr) => arr.indexOf(el) === i);
				}

				fest.headliners = headliners;
				fest.lineup = getLineup(
					fest.bands,
					fest.headliners,
					server.getters.getBands(server.state)
				);

				return fest;
			}

			for (let i = 0; i < server.getters.getNames(server.state).length; i++) {
				state.fests.push(getRandomFest(i));
			}

			shuffle(state.fests);
		},
	},
	actions: {
		async init({
			state,
			commit,
			dispatch,
		}: {
			state: any;
			commit: Function;
			dispatch: Function;
		}) {
			await dispatch("server/loadFireBaseData");
			await dispatch("server/loadGeoData");

			commit("img/setImages");
			commit("setFests");

			console.log(state);

			localStorage.setItem("store", JSON.stringify(state));
		},
		async loadFestMap(_, payload) {
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
		async reInit({ state, dispatch }) {
			localStorage.clear();

			state.fests = [];
			server.state.bands = {};
			server.state.names = [];
			server.state.genres = [];
			server.state.cities = [];
			img.state.freeImg = [];
			settings.state.mainView = "table";

			await dispatch("init");
		},
	},
	getters: {
		getFests(state) {
			return state.fests;
		},
		getFestsById(_, getters) {
			return (id: number) => getters.getFests.find((t: any) => t.id === id);
		},
		getMyFests(_, getters) {
			return getters.getFests.filter((f: any) => f.added === true);
		},
	},
	modules: {
		server,
		img,
		settings,
	},
});
