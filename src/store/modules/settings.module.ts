import { siteSettings } from "@/assets/types/fest.type";

const state: siteSettings = {
	titleAnimate: Boolean(sessionStorage.getItem("titleAnimate") ?? "true"),
	warnModal: Boolean(sessionStorage.getItem("warnModal") ?? "false"),
	sidebar: false,
	mainView:
		JSON.parse(localStorage.getItem("store") || "[]")?.settings?.mainView ??
		"table",
	breakpoints: {
		xs: 600,
		sm: 798,
		md: 1080,
		lg: 1280,
		xl: 1500,
	},
};

const mutations = {
	animateTitle(state: siteSettings) {
		setTimeout(() => {
			state.titleAnimate = false;
		}, 0);

		sessionStorage.setItem("titleAnimate", JSON.stringify(false));
	},
	removeWarnModal(state: siteSettings) {
		state.warnModal = true;
		sessionStorage.setItem("warnModal", JSON.stringify(true));
	},
	openSidebar(state: siteSettings) {
		state.sidebar = true;
		document.body.classList.add("body--sidebar");
	},
	closeSidebar(state: siteSettings) {
		state.sidebar = false;
		document.body.classList.remove("body--sidebar");
	},
	changeMainView(state: siteSettings, type: string) {
		state.mainView = type;
		localStorage.setItem("mainView", type);
	},
};

const getters = {
	getTitleAnimate(state: siteSettings) {
		return state.titleAnimate;
	},
	getWarnModal(state: siteSettings) {
		return state.warnModal;
	},
	getSideBar(state: siteSettings) {
		return state.sidebar;
	},
	getMobileView(state: siteSettings) {
		return window.innerWidth < state.breakpoints.xs;
	},
	getDesktopView(state: siteSettings) {
		return window.innerWidth >= state.breakpoints.xl;
	},
	getMainView(state: siteSettings) {
		return state.mainView;
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	// actions,
	getters,
};
