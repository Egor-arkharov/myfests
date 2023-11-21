<template>
	<div class="auth">
		<p v-if="isLoggedIn && userNick" class="auth__greeting">
			Hi, {{ userNick }}
		</p>

		<div class="auth__log" v-if="!isLoggedIn">
			<div class="auth__user user">
				<div class="user__type">
					<input
						type="radio"
						id="old-user"
						name="user"
						value="old-user"
						class="visuallyhidden"
					/>
					<label class="user__label" for="old-user">Old User</label>
				</div>

				<div class="user__radio"></div>

				<div class="user__type">
					<input
						type="radio"
						id="new-user"
						name="user"
						value="new-user"
						class="visuallyhidden"
					/>
					<label class="user__label" for="new-user">New User</label>
				</div>
			</div>

			<div class="auth__enter">
				<div class="auth__block auth__block--login">
					<form @submit.prevent="oldRegister" class="form">
						<div class="form__group">
							<label class="form__label" for="oldEmail">Login</label>
							<input
								type="text"
								placeholder="Email"
								class="form__input form__input-name"
								id="oldEmail"
								name="oldEmail"
								autocomplete="username"
								v-model="oldEmail"
							/>
						</div>
						<div class="form__group">
							<label class="form__label" for="oldPassword">Password</label>
							<input
								type="password"
								placeholder="Password"
								class="form__input form__input-name"
								id="oldPassword"
								name="oldPassword"
								autocomplete="current-password"
								v-model="oldPassword"
							/>
						</div>
						<button
							type="submit"
							class="form__button btn btn--form"
							:disabled="!(oldEmail && oldPassword)"
						>
							LOG IN
						</button>
					</form>
					<p class="auth__err" v-if="errMsgOld">{{ errMsgOld }}</p>
				</div>
				<div class="auth__block auth__block--signup">
					<form @submit.prevent="newRegister" class="form">
						<div class="form__group">
							<label class="form__label" for="newEmail">Login</label>
							<input
								type="text"
								placeholder="Email"
								class="form__input form__input-name"
								id="newEmail"
								name="newEmail"
								autocomplete="username"
								v-model="newEmail"
							/>
						</div>
						<div class="form__group">
							<label class="form__label" for="newPassword">Password</label>
							<input
								type="password"
								placeholder="Password"
								class="form__input form__input-name"
								id="newPassword"
								name="newPassword"
								autocomplete="current-password"
								v-model="newPassword"
							/>
						</div>
						<div class="form__group">
							<label class="form__label" for="nick">Name</label>
							<input
								type="text"
								placeholder="Name"
								class="form__input form__input-name"
								id="nick"
								name="nick"
								v-model="userNickRef"
								@keyup="validateNickInput"
							/>
						</div>
						<button
							type="submit"
							class="form__button btn btn--form"
							:disabled="!isDisabled"
						>
							SIGN UP
						</button>
					</form>

					<p class="auth__err" v-if="errMsgNew">{{ errMsgNew }}</p>
				</div>
			</div>

			<div class="auth__decor">or</div>

			<button
				type="submit"
				class="form__button btn btn--form btn--google"
				@click="signInWithGoogle"
			>
				<span>Enter with</span>
			</button>
		</div>

		<div class="auth__nick" v-if="isLoggedIn && !userNick">
			<p>
				Oh, looks like u'r a new user!<br />
				Please write your name to fully sign up!
			</p>
			<form @submit.prevent="addName" class="form">
				<div class="form__group">
					<label class="form__label" for="nick">Name</label>
					<input
						type="text"
						placeholder="Name"
						class="form__input form__input-name"
						id="nick"
						name="nick"
						v-model="userNickRef"
						@keyup="validateNickInput(userNickRef)"
					/>
				</div>
				<button
					type="submit"
					class="form__button btn btn--form"
					:disabled="!isDisabled"
				>
					Add Name
				</button>
			</form>
		</div>

		<button
			v-if="isLoggedIn"
			type="submit"
			class="form__button btn btn--form btn--exit"
			@click="handleSignOut"
		>
			Sign Out
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

		const userNickRef = ref("");
		const userNick = computed(() => store.getters["auth/getUserNick"]);

		const auth = getAuth();
		const database = getDatabase();

		const errMsgOld = ref("");
		const errMsgNew = ref("");

		const isLoggedIn = computed(() => store.getters["auth/getLoggedIn"]);
		const isDisabled = ref(false);

		const validateNickInput = () => {
			const inputValue = userNickRef.value;

			const isValidLength = inputValue.length >= 3 && inputValue.length <= 20;

			isDisabled.value = Boolean(isValidLength);
		};

		const errorMessages = {
			"auth/invalid-email": "Invalid email",
			"auth/user-not-found": "No account with that email was found",
			"auth/weak-password": "Incorrect password. Min 6 symbols.",
		};

		const handleAuthError = (err, type) => {
			console.log("Auth Error: ", err);

			const targetErrMsg = type === "old" ? errMsgOld : errMsgNew;
			targetErrMsg.value = errorMessages[err.code] || err.message;
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
				console.log("Can't find old user: ", err);

				handleAuthError(err, "old");
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

				await set(dbRef(database, `users/${user.uid}/nick`), userNickRef);

				store.commit("auth/setAuthState");
				store.commit("auth/setNickName", userNickRef.value);
			} catch (err) {
				console.log("Auth error: ", err, err.code);

				if (err.code === "auth/email-already-in-use") {
					await oldRegister(newEmail, newPassword);
					userNickRef.value = store.getters["auth/getUserNick"];
				} else {
					handleAuthError(err, "new");
				}
			}
		};

		const signInWithGoogle = () => {
			userNickRef.value = "";

			const provider = new GoogleAuthProvider();
			signInWithPopup(getAuth(), provider)
				.then(async (res) => {
					console.log("Google auth correct!:", res.user);
				})
				.catch((err) => {
					console.log("Google auth error", err);
				});
		};

		const handleSignOut = () => {
			signOut(auth).then(() => {
				// store.commit("auth/setNickName", "");
				// store.commit("auth/setAuthState");
				emit("close");
			});
		};

		const addName = async () => {
			const user = store.getters["auth/getUser"];

			await set(dbRef(database, `users/${user.uid}/nick`), userNickRef);

			store.commit("auth/setNickName", userNickRef.value);
		};

		return {
			oldEmail,
			oldPassword,
			newEmail,
			newPassword,
			userNickRef,
			userNick,
			oldRegister,
			newRegister,
			addName,
			signInWithGoogle,
			handleSignOut,
			isLoggedIn,
			isDisabled,
			validateNickInput,
			errMsgOld,
			errMsgNew,
		};
	},
};
</script>

<style lang="scss" scoped>
.btn {
	width: auto;

	&--google {
		width: 160px;
		align-self: center;

		padding: 12px 20px;
		padding-right: 40px;

		position: relative;

		background-color: transparent;
		border-color: $main-color;
		color: $main-color;

		&:hover:not(:disabled),
		&:focus {
			background-color: $main-color;
			color: $white-color;
		}

		&::after {
			content: "";
			position: absolute;

			right: 5px;
			top: 50%;
			translate: 0 -50%;

			width: 25px;
			height: 100%;

			background-image: url("@/assets/icons/google.svg");
			background-repeat: no-repeat;
			background-position: center;
			background-size: contain;
		}

		span {
			display: inline-block;
			translate: 0 2px;
		}
	}

	&--exit {
		width: 200px;
		background-color: transparent;
		border-color: $error-color;
		color: $error-color;

		&:hover:not(:disabled),
		&:focus {
			background-color: $error-color;
			color: $white-color;
		}
	}
}

.form {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 15px;

	// height: 100%;

	&__title {
		margin-right: 20px;
	}

	&__label {
		display: none;
	}

	&__input {
		width: auto;
	}
}

.auth {
	overflow: hidden;

	&__log {
		display: flex;
		flex-direction: column;
	}

	&__greeting {
		margin-bottom: 20px;
		font-family: $main-font-bold;
		@include font-l;
	}

	&__enter {
		width: 200%;
		display: flex;
		justify-content: space-between;

		transition: translate 0.4s ease-in-out;
	}

	&__decor {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin: 20px 0 30px;

		&::before,
		&::after {
			content: "";
			position: absolute;

			top: 50%;
			translate: 0 -50%;

			width: 40%;
			height: 0.1px;

			background-color: black;
		}

		&::before {
			right: 55%;
		}

		&::after {
			left: 55%;
		}
	}

	&__block {
		display: flex;
		justify-content: center;
		width: 100%;

		&--login .btn {
			background-color: transparent;
			border-color: $color-2;
			color: $color-2;

			&:hover:not(:disabled),
			&:focus {
				background-color: $color-2;
				color: $white-color;
			}
		}

		&--signup .btn {
			background-color: transparent;
			border-color: $color-7;
			color: $color-7;

			&:hover:not(:disabled),
			&:focus {
				background-color: $color-7;
				color: $white-color;
			}
		}
	}

	&__err {
		@include font-l;
		color: $error-color;
		margin: 10px 0 0;
	}

	&:has(#new-user:checked) {
		.user__radio::after {
			background-color: $color-7;
			translate: 25px -50%;
		}

		.auth__enter {
			translate: -50% 0;
		}
	}
}

.user {
	position: relative;

	display: flex;
	justify-content: center;
	align-items: center;
	gap: 15px;

	height: 30px;
	margin-bottom: 60px;

	&::after {
		content: "";
		position: absolute;

		bottom: -10px;
		left: 50%;

		height: 1px;
		width: 70%;

		translate: -50% 0;
		height: 1px;

		background-color: $black-color;
	}

	&__label {
		@include font-l;
		cursor: pointer;
	}

	&__radio {
		position: relative;

		width: 50px;
		height: 100%;

		background-color: rgba(55, 59, 77, 0.15);
		border-radius: 14px;

		&::after {
			content: "";
			position: absolute;

			width: 20px;
			height: 20px;

			top: 50%;
			left: 0;

			border-radius: 50%;
			background-color: $color-2;

			translate: 5px -50%;
			transition: all 0.4s ease-in-out;
		}
	}

	// &:has(input:focus) .user__radio {
	// 	outline: 1px solid black;
	// }
}
</style>
