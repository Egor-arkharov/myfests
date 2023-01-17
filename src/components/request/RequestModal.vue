<template>
	<form-name @submit="submitName"></form-name>
	<form-place @submit="submitPlace"></form-place>
	<form-genre @submit="submitGenre"></form-genre>
	<form-bands
		@submit="submitBands"
		:bandsFromGenre="bandsFromGenre"
	></form-bands>
	<form-date @submit="submitDate"></form-date>
	<form @submit.prevent="submitAll">
		<button class="btn primary">Подтвердить</button>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import FormName from "./form/FormName";
import FormPlace from "./form/FormPlace";
import FormGenre from "./form/FormGenre";
import FormBands from "./form/FormBands";
import FormDate from "./form/FormDate";

export default {
	emits: ["created"],
	setup(_, { emit }) {
		const store = useStore();
		const festName = ref("");
		const festPlace = ref("");
		const festGenre = ref("");
		const bandsFromGenre = ref("");
		const festBands = ref([]);
		const festHeadliners = ref([]);
		const festDate = ref([]);
		const festNameAdd = ref(false);
		const festPlaceAdd = ref(false);
		const festGenreAdd = ref(false);

		const submitName = (festNamefromComp) => {
			festName.value = festNamefromComp;
			festNameAdd.value = ref(true);
		};

		const submitPlace = (festPlaceFromComp) => {
			festPlace.value = festPlaceFromComp;
			festPlaceAdd.value = ref(true);
		};

		const submitGenre = (festGenreFromComp) => {
			festGenre.value = festGenreFromComp;
			festGenreAdd.value = ref(true);

			bandsFromGenre.value = store.getters.getBandsByGenre(festGenre.value);
		};

		const submitBands = (festBandsFromComp) => {
			festHeadliners.value = festBandsFromComp.headliners;
			festBands.value = festBandsFromComp.bands;
		};

		const submitDate = (festDatefromComp) => {
			festDate.value = festDatefromComp;
		};

		const submitAll = () => {
			const fest = {
				name: festName.value,
				place: festPlace.value,
				genre: festGenre.value,
				bands: festBands.value,
				headliners: festHeadliners.value,
				date: festDate.value,
			};

			store.commit("addFest", fest);
			emit("created");
		};

		return {
			bandsFromGenre,
			submitName,
			submitPlace,
			submitGenre,
			submitBands,
			submitDate,
			submitAll,
		};
	},
	components: {
		FormName,
		FormPlace,
		FormGenre,
		FormBands,
		FormDate,
	},
};
</script>

<style scoped lang="scss">
form {
	width: 30%;
	margin: 10px 0 20px;
	outline: 1px solid black;
	outline-offset: 3px;
}
</style>
