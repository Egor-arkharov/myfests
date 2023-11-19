<template>
	<div class="auth">
		<p v-if="isLoggedIn && userNick" class="auth__greeting">
			Hi, {{ userNick }}
		</p>

		<div class="user">
			<input type="radio" id="old-user" name="user" value="old-user" />
			<label for="old-user">Old User</label>

			<div class="user__custom">
				<div class="user__circle"></div>
			</div>

			<input type="radio" id="new-user" name="user" value="new-user" />
			<label for="new-user">New User</label>
		</div>

		<div class="auth__enter">
			<div class="auth__log auth__block">
				<form @submit.prevent="oldRegister">
					<p>OLD USER (УЖЕ ЗАРЕГЕСТРИРОВАНЫ) (Log in)</p>
					<div class="form-group">
						<label for="oldEmail">Логин</label>
						<input
							type="text"
							placeholder="Email"
							class="form-control"
							id="oldEmail"
							name="oldEmail"
							autocomplete="username"
							v-model="oldEmail"
						/>
					</div>
					<div class="form-group">
						<label for="oldPassword">Пароль</label>
						<input
							type="password"
							placeholder="Password"
							class="form-control"
							id="oldPassword"
							name="oldPassword"
							autocomplete="current-password"
							v-model="oldPassword"
						/>
					</div>
					<button type="submit" class="btn">LOG IN</button>
				</form>

				<p v-if="errMsg">{{ errMsg }}</p>
			</div>
			<div class="auth__sign auth__block">
				<form @submit.prevent="newRegister">
					<p>NEW USER (РЕГИСТРИРУЕМСЯ) (SIGN UP)</p>
					<div class="form-group">
						<label for="newEmail">Логин</label>
						<input
							type="text"
							placeholder="Email"
							class="form-control"
							id="newEmail"
							name="newEmail"
							autocomplete="username"
							v-model="newEmail"
						/>
					</div>
					<div class="form-group">
						<label for="newPassword">Пароль</label>
						<input
							type="password"
							placeholder="Password"
							class="form-control"
							id="newPassword"
							name="newPassword"
							autocomplete="current-password"
							v-model="newPassword"
						/>
					</div>
					<div class="form-group">
						<label for="nick">Ник</label>
						<input
							type="text"
							placeholder="Введите ник"
							class="form-control"
							id="nick"
							name="nick"
							v-model="userNick"
							@keyup="validateNickInput"
						/>
					</div>
					<button type="submit" class="btn" :disabled="!isDisabled">
						SIGN UP
					</button>
				</form>

				<p v-if="errMsg">{{ errMsg }}</p>
			</div>
		</div>
		<button type="submit" class="btn" @click="signInWithGoogle">
			Войти Гугл
		</button>
		<button v-if="isLoggedIn" type="submit" class="btn" @click="handleSignOut">
			Выйти
		</button>
	</div>
</template>

<script>
import { ref, computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import { getDatabase, ref as dbRef, set } from "firebase/database";

export default {
	setup(_, { emit }) {
		const store = useStore();

		const oldEmail = ref("");
		const oldPassword = ref("");

		const newEmail = ref("");
		const newPassword = ref("");

		const userNick = ref(store.getters["auth/getUserNick"]);

		const auth = getAuth();
		const database = getDatabase();

		const errMsg = ref("");

		const isDisabled = ref(false);

		const validateNickInput = () => {
			const inputValue = userNick.value;

			const isValidLength = inputValue.length >= 3 && inputValue.length <= 20;

			isDisabled.value = Boolean(isValidLength);
		};

		const errorMessages = {
			"auth/invalid-email": "Invalid email",
			"auth/user-not-found": "No account with that email was found",
			"auth/weak-password": "Incorrect password. Min 6 symbols.",
		};

		const handleAuthError = (err) => {
			console.log("Ошибка при обработке авторизации: ", err);

			errMsg.value = errorMessages[err.code] || err.message;
		};

		const oldRegister = async (email, password) => {
			try {
				if (oldEmail.value) {
					email = oldEmail;
					password = oldPassword;
				}

				const userCredential = await signInWithEmailAndPassword(
					auth,
					email.value,
					password.value
				);

				const user = userCredential.user;

				console.log("OLD USER", user);

				store.commit("auth/setAuthState");
			} catch (err) {
				console.log(oldEmail.value, oldPassword.value);
				console.log("Пользователь не найден: ", err);

				handleAuthError(err);
			}
		};

		const newRegister = async () => {
			try {
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					newEmail.value,
					newPassword.value
				);

				const user = userCredential.user;

				console.log("NEW USER", user);

				await set(dbRef(database, `users/${user.uid}/nick`), userNick);

				store.commit("auth/setAuthState");
				store.commit("auth/setNickName", userNick.value);
			} catch (err) {
				console.log("Ошибка при регистрации: ", err, err.code);

				if (err.code === "auth/email-already-in-use") {
					await oldRegister(newEmail, newPassword);
					userNick.value = store.getters["auth/getUserNick"];
				} else {
					handleAuthError(err);
				}
			}
		};

		const signInWithGoogle = () => {
			const provider = new GoogleAuthProvider();
			signInWithPopup(getAuth(), provider)
				.then((res) => {
					console.log(res.user);
					emit("close");
				})
				.catch((err) => {
					console.log(err);
				});
		};

		const handleSignOut = () => {
			signOut(auth).then(() => {
				store.commit("auth/setNickName", "");
				store.commit("auth/setAuthState");
				emit("close");
			});
		};

		const isLoggedIn = computed(() => store.getters["auth/getLoggedIn"]);

		return {
			oldEmail,
			oldPassword,
			newEmail,
			newPassword,
			userNick,
			oldRegister,
			newRegister,
			signInWithGoogle,
			handleSignOut,
			isLoggedIn,
			isDisabled,
			validateNickInput,
			errMsg,
		};
	},
};
</script>

<style lang="scss" scoped>
.form-group {
	margin-bottom: 20px;
}

label {
	margin-right: 10px;
}

.btn {
	padding: 10px 20px;
	border: 1px solid black;
	margin-top: 30px;
	margin-right: 50px;
}

input {
	height: 30px;
	padding: 5px 10px;
}

.auth {
	overflow: hidden;

	&__greeting {
		margin-bottom: 20px;
		font-family: $main-font-bold;
		@include font-l;
	}

	&__enter {
		width: 200%;
		display: flex;
		justify-content: space-between;

		padding-bottom: 10px;
		border-bottom: 5px solid #000;

		transition: translate 0.4s ease-in-out;
	}

	&__log,
	&__sign {
		p {
			margin-bottom: 20px;
		}
	}

	&__block {
		width: 100%;
	}

	&:has(#new-user:checked) {
		.user__circle {
			background-color: blue;

			translate: 100% 0;
		}

		.auth__enter {
			translate: -50% 0;
		}
	}
}

.user {
	margin-bottom: 20px;
	display: flex;

	&__custom {
		position: relative;
		// left: 0;

		width: 48px;
		height: 28px;

		background-color: rgba(55, 59, 77, 0.3);
		border-radius: 14px;
	}

	&__circle {
		position: absolute;

		width: 20px;
		height: 20px;

		top: 4px;
		left: 4px;
		border-radius: 50%;

		background-color: #ffffff;

		translate: 0 0;
		transition: translate 0.4s ease-in-out;
	}

	input {
		display: none;
	}
}
</style>
