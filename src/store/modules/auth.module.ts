import store from "../index";
import { auth } from "@/assets/types/fest.type";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as dbRef, set, onValue } from "firebase/database";

const state: auth = {
	isLoggedIn:
		JSON.parse(localStorage.getItem("user") || "false")?.isLoggedIn ?? false,
	nick: JSON.parse(localStorage.getItem("user") || "")?.nick ?? "",
};

export default {
	namespaced: true,
	state,
	mutations: {
		setAuthState(state: auth) {
			const auth = getAuth();

			auth.onAuthStateChanged((user) => {
				state.isLoggedIn = !!user;

				if (user) {
					const userUID = user.uid;
					const userNickRef = dbRef(getDatabase(), `users/${userUID}/nick`);

					onValue(userNickRef, (snapshot) => {
						if (snapshot.exists()) {
							const nick = snapshot.val()._value;
							store.commit("auth/setNickName", nick);

							localStorage.setItem("user", JSON.stringify(state));
						} else {
							console.log("Ник пользователя не найден в базе данных");
						}
					});
				} else {
					localStorage.setItem("user", JSON.stringify(state));
				}
			});
		},
		setNickName(state: auth, nick: string) {
			state.nick = nick;
		},
	},
	getters: {
		getLoggedIn(state: auth) {
			return state.isLoggedIn;
		},
		getUserNick(state: auth) {
			return state.nick;
		},
	},
};
