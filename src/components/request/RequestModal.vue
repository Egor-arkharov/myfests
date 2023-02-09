<template>
	<ol class="forms__list">
		<li class="forms__item">
			<form-name @submit="submitName"></form-name>
		</li>
		<li class="forms__item" :class="{ visuallyhidden: !festName }">
			<form-place @submit="submitPlace"></form-place>
		</li>
		<li class="forms__item" :class="{ visuallyhidden: !festPlace }">
			<form-date @submit="submitDate"></form-date>
		</li>
		<li class="forms__item" :class="{ visuallyhidden: !festDate.length }">
			<form-genre @submit="submitGenre"></form-genre>
		</li>
		<li
			class="forms__item forms__item--big"
			:class="{ visuallyhidden: !festGenre }"
		>
			<form-bands
				@submit="submitBands"
				:bandsFromGenre="bandsFromGenre"
			></form-bands>
		</li>
		<li
			class="forms__item forms__item--big"
			:class="{ visuallyhidden: !festBands.length }"
		>
			<form-img @submit="submitImg"></form-img>
		</li>
	</ol>
	<form v-if="festImg" @submit.prevent="submitAll">
		<button class="btn">Подтвердить</button>
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
import FormImg from "./form/FormImg";

export default {
	emits: ["created"],
	setup(_, { emit }) {
		const store = useStore();
		const festImg = ref("");
		const festName = ref("");
		const festPlace = ref("");
		const festGenre = ref("");
		const bandsFromGenre = ref("");
		const festBands = ref([]);
		const festHeadliners = ref([]);
		const festDate = ref([]);

		const submitName = (festNamefromComp) =>
			(festName.value = festNamefromComp);

		const submitPlace = (festPlaceFromComp) =>
			(festPlace.value = festPlaceFromComp);

		const submitGenre = (festGenreFromComp) => {
			festGenre.value = festGenreFromComp;
			bandsFromGenre.value = store.getters.getBandsByGenre(festGenre.value);
		};

		const submitBands = (festBandsFromComp) => {
			festHeadliners.value = festBandsFromComp.headliners;
			festBands.value = festBandsFromComp.bands;
		};

		const submitDate = (festDatefromComp) =>
			(festDate.value = festDatefromComp);

		const submitImg = (festImgFromComp) => (festImg.value = festImgFromComp);

		const submitAll = () => {
			const fest = {
				img: festImg.value,
				name: festName.value,
				place: festPlace.value,
				genre: festGenre.value,
				bands: festBands.value,
				headliners: festHeadliners.value,
				date: festDate.value,
			};

			console.log("nenenn", festBands.value, festHeadliners.value);

			store.commit("addFest", fest);
			emit("created");
		};

		return {
			bandsFromGenre,
			festImg,
			festName,
			festPlace,
			festGenre,
			festBands,
			festDate,
			submitImg,
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
		FormImg,
	},
};
</script>

<style scoped lang="scss">
.visuallyhidden {
	margin: 0;
}

.forms {
	&__list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		list-style: none;
		counter-reset: counter;
	}

	&__item {
		position: relative;
		counter-increment: counter;
		width: 20%;
		padding-left: 70px;
		margin-bottom: 100px;

		&--big {
			width: 45%;
		}

		&::before {
			content: "0" counter(counter);
			position: absolute;

			left: -30px;

			font-size: 64px;
			font-weight: 900;
		}

		&::after {
			content: "";
			position: absolute;
			width: 100px;
			height: 100px;
			border: 3px solid;
			border-radius: 50%;

			top: -10px;
			left: -47px;
		}
	}

	@for $i from 1 through length($form-colors) {
		&__item:nth-child(#{$i}) {
			&::before {
				color: nth($form-colors, $i);
			}

			&::after {
				border-color: nth($form-colors, $i);
			}
		}
	}
}
</style>
