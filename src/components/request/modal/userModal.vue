<template>
	<div class="settings">
		<p v-if="isLoggedIn && userNick" class="settings__greeting">
			Hi, {{ userNick }}
		</p>
		<form @submit.prevent="editName" class="form">
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
				Edit Name
			</button>
		</form>

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
	// createUserWithEmailAndPassword,
	// signInWithEmailAndPassword,
	signOut,
	// GoogleAuthProvider,
	// signInWithPopup,
} from "firebase/auth";
import { getDatabase, ref as dbRef, set } from "firebase/database";

export default {
	setup(_, { emit }) {
		const store = useStore();
		const auth = getAuth();
		const database = getDatabase();

		const isLoggedIn = computed(() => store.getters["auth/getLoggedIn"]);
		const userNick = computed(() => store.getters["auth/getUserNick"]);
		const userNickRef = ref("");
		const isDisabled = ref(false);

		const validateNickInput = () => {
			const inputValue = userNickRef.value;

			const isValidLength = inputValue.length >= 3 && inputValue.length <= 20;

			isDisabled.value = Boolean(isValidLength);
		};

		const editName = async () => {
			console.log("ADD");

			const user = store.getters["auth/getUser"];

			await set(dbRef(database, `users/${user.uid}/nick`), userNickRef);

			store.commit("auth/setNickName", userNickRef.value);
		};

		const handleSignOut = () => {
			signOut(auth).then(async () => {
				emit("close");
				// await store.dispatch("reInit");
				// await store.dispatch("fest/loadFests");
			});
		};

		return {
			isLoggedIn,
			isDisabled,
			userNick,
			userNickRef,
			validateNickInput,
			handleSignOut,
			editName,
		};
	},
};
</script>

<style lang="scss" scoped>
.btn {
	&--exit {
		margin-top: auto;
		align-self: end;
		background-color: transparent;
		border-color: $error-color;
		color: $error-color;

		&:hover:not(:disabled),
		&:focus {
			background-color: $error-color;
			color: $white-color;
		}
	}

	&--form {
		@include hover {
			background-color: black;
			color: white;
		}
	}
}

.settings {
	flex-grow: 1;
	display: flex;
	flex-direction: column;

	&__greeting {
		margin-bottom: 20px;
		font-family: $main-font-bold;
		@include font-l;
	}
}
</style>
