import store from "../index";
import server from "./server.module";
import img from "./img.module";
import auth from "./auth.module";
import loader from "@/use/googleMapsStore";
import { FestData, festState, DateRange } from "@/assets/types/fest.type";
import {
	AMOUNT_HEADLINERS,
	AMOUNT_BANDS,
	getMixedBands,
	getLineup,
	getRandomInt,
	shuffle,
} from "@/use/utils";
import { ActionContext } from "vuex";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";

export default {
	namespaced: true,
	state: {
		fests: JSON.parse(localStorage.getItem("fest") || "[]")?.fests ?? [],
		generatingFests: false,
		stopGeneration: false,
		festsReseted: false,
		generatedFestsCount:
			JSON.parse(localStorage.getItem("generatedFestsCount") || "0") ?? 0,
		generatingFestsTotal:
			JSON.parse(localStorage.getItem("generatingFestsTotal") || "0") ?? 0,
		looping: false,
	},
	mutations: {
		addFest(state: festState, payload: any) {
			const allBands = store.getters["server/getBands"];

			const newFest: FestData = {
				name: payload.name,
				place: payload.place,
				date: payload.date,
				genre: payload.genre,
				bands: payload.bands.concat(payload.headliners),
				headliners: payload.headliners,
				lineup: getLineup(payload.bands, payload.headliners, allBands),
				img: payload.img,
				id: Math.random().toString(36).substr(2, 9),
				added: false,
				own: false,
			};

			state.fests.push(newFest);

			localStorage.setItem("fest", JSON.stringify(state));

			// console.log(state.getters("getFests"));

			if (store.getters["auth/getLoggedIn"]) {
				const user = store.getters["auth/getUser"];
				const database = getDatabase();
				set(dbRef(database, `users/${user.uid}/fests`), state.fests);
			}
		},
		changeMyFests(state: festState, payload: FestData) {
			const fest = state.fests.find((el: FestData) => el === payload);

			if (fest) {
				fest.added = !fest.added;
				localStorage["fest"] = JSON.stringify(state);
			}
		},
		sortFests(state: festState, sortSettings: any) {
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
		setGeneratingFests(state: festState, payload: Boolean) {
			state.generatingFests = payload;
		},
		setGeneratedFests(state: festState, payload: number) {
			state.generatedFestsCount = payload;
			localStorage.setItem("generatedFestsCount", JSON.stringify(payload));
		},
		setGeneratingFestsTotal(state: festState, payload: number) {
			state.generatingFestsTotal = payload;
			localStorage.setItem("generatingFestsTotal", JSON.stringify(payload));
		},
		resetFests(state: festState) {
			state.fests = [];
			localStorage.setItem("fest", JSON.stringify(state));

			state.generatedFestsCount = 0;
			localStorage.setItem("generatingFestsTotal", JSON.stringify(0));

			state.festsReseted = true;
		},
		setResetedFests(state: festState, payload: Boolean) {
			state.festsReseted = payload;
		},
		stopGeneration(state: festState, payload: Boolean) {
			state.stopGeneration = payload;
		},
		setFests(state: festState, payload: []) {
			state.fests = payload;
		},
		setLooping(state: festState, payload: Boolean) {
			state.looping = payload;
		},
	},
	actions: {
		async loadFestMap(_: any, payload: any) {
			const myLatLng = {
				lat: +payload.place.latitude,
				lng: +payload.place.longitude,
			};

			const mapOptions = {
				center: myLatLng,
				zoom: 8,
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
		async loadFests(context: ActionContext<festState, {}>) {
			console.log("Начинаю loadFests");

			context.commit("setResetedFests", false);
			context.commit("stopGeneration", false);

			await store.dispatch("server/loadCountries");

			const isLoggedIn = store.getters["auth/getLoggedIn"];

			console.log(
				"LOAD FESTS getGeneratedFests",
				context.getters.getGeneratedFests
			);

			let numberToGenerate: number = 0;

			if (isLoggedIn) {
				numberToGenerate = server.getters.getGenres(server.state).length;

				context.commit("setGeneratingFestsTotal", numberToGenerate);

				await context.dispatch("generateAuthFests", numberToGenerate);
			} else {
				numberToGenerate = server.getters.getNames(server.state).length;

				context.commit("setGeneratingFestsTotal", numberToGenerate);

				await context.dispatch("generateFests", numberToGenerate);
			}

			console.log("Конец loadFests");
		},
		async generateAuthFests(
			context: ActionContext<festState, {}>,
			numberToGenerate: number
		) {
			const user = store.getters["auth/getUser"];
			const database = getDatabase();

			const userUID = user.uid;
			const userFests = dbRef(database, `users/${userUID}/fests`);

			try {
				const snapshot = await get(userFests);

				if (snapshot.exists()) {
					// console.log("Database has fests:", snapshot.val());
					store.commit("auth/setFirstTimeAuth", false);

					// Загружаем фесты из Firebase
					context.commit("setFests", snapshot.val());
				} else {
					// console.log("No fests in DataBase");

					context.state.fests = [];

					// Генерируем фесты сами
					await context.dispatch("generateFests", numberToGenerate);

					store.commit("auth/setFirstTimeAuth", true);
				}
			} catch (error) {
				console.error("Error fetching fests:", error);
			}

			// console.log("AFTER GENERATING", context.state.fests);
		},
		async generateFests(
			context: ActionContext<festState, {}>,
			festAmount: number
		) {
			console.log("Начинаю generateFests", festAmount, "фестивалей");
			context.commit("setGeneratingFests", true);

			try {
				for (let i = 0; i < festAmount; i++) {
					context.commit("setLooping", true);

					const isStopGeneration = context.getters["getStopGeneration"];

					if (isStopGeneration) {
						console.log("Останавливаю генерацию, очищаю фесты");
						context.commit("resetFests");
						context.commit("setLooping", false);

						break;
					} else {
						const newFest = await context.dispatch("getRandomFest");

						console.log(
							"Добавляю новый фест",
							newFest,
							"в массив из",
							festAmount,
							"фестивалей"
						);

						const generatedFests = context.getters["getGeneratedFests"];
						const generatingFestsTotal =
							context.getters["getGeneratingFestsTotal"];
						context.commit("addFest", newFest);
						context.commit("setGeneratedFests", generatedFests + 1);

						if (generatedFests > generatingFestsTotal) {
							console.error("Generating more fests then need");
							context.commit("stopGeneration", true);
						}
					}
				}
			} catch (error) {
				console.error("Error generating fests:", error);
				throw error;
			}

			console.log(
				"Конец generateFests. Всего было зарегестрировано",
				context.getters.getGeneratedFests,
				"из",
				context.getters.getGeneratingFestsTotal
			);

			if (
				context.getters.getGeneratedFests ===
				context.getters.getGeneratingFestsTotal
			) {
				context.commit("stopGeneration", true);
				context.commit("setGeneratingFests", false);
				context.commit("setLooping", false);
			}
		},
		async getRandomFest(context: ActionContext<festState, {}>) {
			function getName() {
				const names = server.getters.getNames(server.state);

				const existingNames = new Set(
					context.state.fests.map((obj) => obj.name)
				);
				const missingNames = names.filter((name) => !existingNames.has(name));

				return (
					missingNames[getRandomInt(missingNames.length)] ||
					`Fest № ${context.state.fests.length + 1}`
				);
			}

			function getGenre() {
				const genres = server.getters.getGenres(server.state);

				const existingGenres = new Set(
					context.state.fests.map((obj) => obj.genre)
				);
				const missingGenres = genres.filter(
					(genre) => !existingGenres.has(genre)
				);

				return (
					missingGenres[0] ||
					server.getters.getGenres(server.state)[
						getRandomInt(server.getters.getGenres(server.state).length)
					]
				);
			}

			function getDate(): DateRange {
				const options: Intl.DateTimeFormatOptions = {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				};

				const startUnix = new Date().setDate(getRandomInt(300));
				const startDate = new Date(startUnix);
				const startDateString = startDate.toLocaleDateString("ru-RU", options);

				const copyDateStart = startDate.toISOString();

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

			function getImg() {
				const imgs = img.getters.getReservedImg(img.state);
				const existingImgs = new Set(context.state.fests.map((obj) => obj.img));

				const missingImgs = imgs.filter(
					(img) => !existingImgs.has(img.slice(1))
				);

				const newimg =
					missingImgs[0] ||
					img.getters.getReservedImg(img.state)[
						getRandomInt(img.getters.getReservedImg(img.state).length)
					];

				return newimg.slice(1);
			}

			async function getPlace() {
				try {
					let countries = store.getters["server/getCountries"];

					if (!countries) {
						countries = await store.dispatch("server/loadCountries");
					}

					let place;

					while (!place) {
						const result = await store.dispatch("server/loadCities", countries);

						if (result) {
							place = result;
						}
					}

					return place;
				} catch (error) {
					console.error(error);
				}
			}

			function getBands() {
				const bands =
					fest.genre !== "Mix"
						? getGenreBands(fest.genre)
						: getMixedBands(
								server.getters.getGenres(server.state),
								server.getters.getBands(server.state),
								AMOUNT_BANDS
						  );

				return bands;
			}

			function getHeadliners() {
				let headliners: FestData["headliners"] = [];

				while (headliners.length !== AMOUNT_HEADLINERS) {
					headliners.push(fest.bands[getRandomInt(fest.bands.length)]);
					headliners = headliners.filter((el, i, arr) => arr.indexOf(el) === i);
				}

				return headliners;
			}

			const fest: FestData = {
				name: getName(),
				place: await getPlace(),
				date: getDate(),
				genre: getGenre(),
				bands: [],
				headliners: [],
				lineup: {},
				img: getImg(),
				id: Math.random().toString(36).substr(2, 9),
				added: false,
				own: false,
			};

			fest.bands = getBands();

			fest.headliners = getHeadliners();

			fest.lineup = getLineup(
				fest.bands,
				fest.headliners,
				server.getters.getBands(server.state)
			);

			return fest;
		},
	},
	getters: {
		getFests(state: festState) {
			return state.fests;
		},
		getFestsById: (_: any, getters: any) => (id: string) => {
			return getters.getFests.find((f: FestData) => f.id === id);
		},
		getMyFests(_: any, getters: any) {
			return getters.getFests.filter((f: FestData) => f.added === true);
		},
		getGeneratingFests(state: festState) {
			return state.generatingFests;
		},
		getGeneratedFests(state: festState) {
			return state.generatedFestsCount;
		},
		getGeneratingFestsTotal(state: festState) {
			return state.generatingFestsTotal;
		},
		getStopGeneration(state: festState) {
			return state.stopGeneration;
		},
		getResetedFests(state: festState) {
			return state.festsReseted;
		},
		getLooping(state: festState) {
			return state.looping;
		},
	},
};
