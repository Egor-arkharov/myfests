import { createStore, createLogger } from "vuex";
import server from "./modules/server.module";
import img from "./modules/img.module";
import settings from "./modules/settings.module";
import fest from "./modules/fest.module";

const plugins = [];

if (process.env.NODE_ENV === "development") {
	plugins.push(createLogger());
}

export default createStore({
	plugins,
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
			commit("fest/setFests");

			localStorage.setItem("fest", JSON.stringify(state.fest));
			localStorage.setItem("img", JSON.stringify(state.img));
			localStorage.setItem("settings", JSON.stringify(state.settings));
			localStorage.setItem("server", JSON.stringify(state.server));
		},
		async reInit({ state, dispatch }) {
			localStorage.clear();

			state.fest.fests = [];
			state.server.bands = {};
			state.server.names = [];
			state.server.genres = [];
			state.server.cities = [];
			state.img.freeImg = [];

			await dispatch("init");
		},
	},
	modules: {
		server,
		img,
		settings,
		fest,
	},
});
