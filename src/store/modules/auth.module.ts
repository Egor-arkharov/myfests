import store from "../index";
import { auth as AuthState } from "@/assets/types/fest.type";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import { ActionContext } from "vuex";
import { User as FirebaseUser } from "firebase/auth";

const storedUser = JSON.parse(localStorage.getItem("auth") || "{}");

const state: AuthState = {
	isLoggedIn: storedUser.isLoggedIn ?? false,
	firstTimeAuth: storedUser.firstTimeAuth ?? true,
	nick: storedUser.nick ?? "",
	user: storedUser.user ?? "",
};

const mutations = {
	setAuthState(state: AuthState, payload: AuthState) {
		console.log("Mutate setAuthState", payload);

		state.isLoggedIn = payload.isLoggedIn;
		state.user = payload.user;
		state.nick = payload.nick;
		localStorage.setItem("auth", JSON.stringify(state));

		console.log("End of setting state", state);
	},
	setNickName(state: AuthState, nick: string) {
		console.log("Set nick");

		state.nick = nick;

		localStorage.setItem("auth", JSON.stringify(state));
	},
	setFirstTimeAuth(state: AuthState, value: Boolean) {
		state.firstTimeAuth = value;
	},
};

const actions = {
	async initAuth(context: ActionContext<AuthState, {}>) {
		const auth = getAuth();

		console.log("initAuth", context.state);

		auth.onAuthStateChanged(async (user: FirebaseUser | null) => {
			console.log("Auth start changing", context.state);

			let nick = "";

			if (user) {
				console.log("Database has User");

				const userUID = user.uid;
				const userNickRef = dbRef(getDatabase(), `users/${userUID}/nick`);

				try {
					const snapshot = await get(userNickRef);

					if (snapshot.exists()) {
						console.log("Database has nick:", snapshot.val());
						nick = snapshot.val()._value;
					} else {
						console.log("No nick in DataBase");
						nick = "";
					}
				} catch (error) {
					console.error("Error fetching nick:", error);
				}
			} else {
				console.log("No user in DataBase");
			}

			console.log("Auth before setting", context.state);

			context.commit("setAuthState", {
				isLoggedIn: !!user,
				user,
				nick,
			});

			console.log("Auth ends", context.state);
		});
	},
};

const getters = {
	getLoggedIn(state: AuthState) {
		return state.isLoggedIn;
	},
	getUserNick(state: AuthState) {
		return state.nick;
	},
	getUser(state: AuthState) {
		return state.user;
	},
	getfirstTimeAuth(state: AuthState) {
		return state.firstTimeAuth;
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	getters,
	actions,
};
