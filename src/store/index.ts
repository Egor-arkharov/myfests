import { createStore, createLogger } from "vuex";
import server from "./modules/server.module";
import img from "./modules/img.module";
import settings from "./modules/settings.module";
import fest from "./modules/fest.module";
import auth from "./modules/auth.module";

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
			getters,
		}: {
			state: any;
			commit: Function;
			dispatch: Function;
			getters: any;
		}) {
			await dispatch("server/loadFireBaseData");

			commit("img/setImages");

			await dispatch("server/loadCountries");

			await dispatch("fest/loadFests");

			localStorage.setItem("fest", JSON.stringify(state.fest));
			localStorage.setItem("img", JSON.stringify(state.img));
			localStorage.setItem("settings", JSON.stringify(state.settings));
			localStorage.setItem("server", JSON.stringify(state.server));
		},
		async reInit({ state, dispatch }: { state: any; dispatch: Function }) {
			localStorage.clear();
			console.log("local cleared: ", localStorage);
			// localStorage.removeItem("fest");
			// localStorage.removeItem("img");
			// localStorage.removeItem("server");
			// localStorage.removeItem("settings");
			// localStorage.removeItem("auth");

			state.fest.fests = [];
			state.server.bands = {};
			state.server.names = [];
			state.server.genres = [];
			state.img.freeImg = [];

			await dispatch("init");
		},
	},
	modules: {
		server,
		img,
		settings,
		fest,
		auth,
	},
});
