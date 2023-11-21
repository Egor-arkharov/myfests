import store from "../index";
import { getRandomInt } from "@/use/utils";
import { imgData } from "@/assets/types/fest.type";

export default {
	namespaced: true,
	state: {
		reservedImg: [],
		freeImg: JSON.parse(localStorage.getItem("img") || "[]")?.freeImg ?? [],
	},
	mutations: {
		setImages(state: imgData): void {
			const IMG_AMOUNT = require
				.context("@/assets/images/fests/", true, /^.*\.jpg$/)
				.keys();

			while (
				state.reservedImg.length !== store.getters["server/getNames"].length
			) {
				state.reservedImg.push(
					IMG_AMOUNT[getRandomInt(IMG_AMOUNT.length)].slice(0, -4)
				);
				state.reservedImg = state.reservedImg.filter(
					(el, i, arr) => arr.indexOf(el) === i
				);
			}

			IMG_AMOUNT.forEach((el) =>
				state.reservedImg.includes(el.slice(0, -4))
					? ""
					: state.freeImg.push(el.slice(1, -4))
			);
		},
	},
	getters: {
		getFreeImg(state: imgData) {
			return state.freeImg;
		},
		getReservedImg(state: imgData) {
			return state.reservedImg;
		},
	},
};
