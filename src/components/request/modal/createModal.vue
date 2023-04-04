<template>
	<div class="forms">
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
				<form-bands @submit="submitBands" :genre="festGenre"></form-bands>
			</li>
			<li
				class="forms__item forms__item--big"
				:class="{ visuallyhidden: !festBands.length && !festImg }"
			>
				<form-img @submit="submitImg"></form-img>
			</li>
		</ol>
	</div>
	<form
		v-if="festImg"
		@submit.prevent="submitAll"
		class="preview"
		ref="preview"
	>
		<h4 class="preview__title">Preview</h4>
		<ul class="preview__list">
			<li class="preview__item">
				<span class="preview__field">Name:&nbsp;</span> {{ festName }}
			</li>
			<li class="preview__item">
				<span class="preview__field">Place:&nbsp;</span>
				{{ festPlace.name + ", " + festPlace.countryName }}
			</li>
			<li class="preview__item">
				<span class="preview__field">Date:&nbsp;</span
				>{{ festDate[0] + " - " + festDate[1] }}
			</li>
			<li class="preview__item">
				<span class="preview__field">Genre:&nbsp;</span>{{ festGenre }}
			</li>
			<li class="preview__item" :class="{ not_full: !festHeadliners.length }">
				<span class="preview__field">Headliners:&nbsp;</span>
				<span v-if="festHeadliners.length">{{
					festHeadliners.join(", ")
				}}</span>
			</li>
			<li class="preview__item" :class="{ not_full: !festBands.length }">
				<span class="preview__field">Other Bands:&nbsp;</span>
				<span v-if="festBands.length">{{
					festBands.filter((el) => !festHeadliners.includes(el)).join(", ")
				}}</span>
			</li>
			<li class="preview__item">
				<span class="preview__field">Img:&nbsp;</span>
				<picture v-if="festImg.startsWith('/img-')">
					<source type="image/webp" :srcset="getImgUrl(festImg + '.webp')" />
					<img
						class="preview__img"
						:src="getImgUrl(festImg + '.jpg')"
						:alt="'Photo of the ' + festName + ' festival'"
					/>
				</picture>
				<img
					v-else
					class="preview__img"
					:src="festImg"
					:alt="'Photo of the ' + festName + ' festival'"
				/>
			</li>
			<fest-desc v-if="festImg" :fest="previewData"></fest-desc>
		</ul>
		<button class="btn btn--form-main" :disabled="!festBands.length">
			Submit
		</button>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { watchEffect } from "@vue/runtime-core";
import FormName from "../form/FormName";
import FormPlace from "../form/FormPlace";
import FormGenre from "../form/FormGenre";
import FormBands from "../form/FormBands";
import FormDate from "../form/FormDate";
import FormImg from "../form/FormImg";
import FestDesc from "@/components/ui/Fest/FestDesc.vue";

export default {
	emits: ["close"],
	setup(_, { emit }) {
		const store = useStore();

		const festName = ref("");
		const festPlace = ref("");
		const festDate = ref([]);
		const festGenre = ref("");
		const festHeadliners = ref([]);
		const festBands = ref([]);
		const festImg = ref("");

		const preview = ref(null);
		const previewData = ref({});

		const submitName = (festNamefromComp) =>
			(festName.value = festNamefromComp);

		const submitPlace = (festPlaceFromComp) =>
			(festPlace.value = festPlaceFromComp);

		const submitDate = (festDatefromComp) =>
			(festDate.value = festDatefromComp);

		const submitGenre = (festGenreFromComp) => {
			festHeadliners.value = ref([]);
			festBands.value = ref([]);
			festGenre.value = festGenreFromComp;
		};

		const submitBands = (festBandsFromComp) => {
			festHeadliners.value = festBandsFromComp.headliners;
			festBands.value = festBandsFromComp.bands;
		};

		const submitImg = (festImgFromComp) => {
			festImg.value = festImgFromComp;

			previewData.value = {
				name: festName.value,
				place: festPlace.value,
				date: festDate.value,
				genre: festGenre.value,
				headliners: festHeadliners.value,
				bands: festBands.value,
			};
		};

		watchEffect(() => {
			if (preview.value) {
				preview.value.scrollIntoView({ behavior: "smooth" });
			}
		});

		const getImgUrl = (img) => require("@/assets/images/fests" + img);

		const submitAll = () => {
			const fest = {
				name: festName.value,
				place: festPlace.value,
				date: festDate.value,
				genre: festGenre.value,
				headliners: festHeadliners.value,
				bands: festBands.value,
			};

			store.commit("addFest", fest);
			emit("close");
		};

		return {
			festName,
			festPlace,
			festDate,
			festGenre,
			festHeadliners,
			festBands,
			festImg,
			submitName,
			submitPlace,
			submitDate,
			submitGenre,
			submitBands,
			submitImg,
			submitAll,
			preview,
			previewData,
			getImgUrl,
			FestDesc,
		};
	},
	components: {
		FormName,
		FormPlace,
		FormDate,
		FormGenre,
		FormBands,
		FormImg,
		FestDesc,
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
			width: 100%;
		}

		&::before {
			content: "0" counter(counter);
			position: absolute;

			font-family: $main-font-semibold;
			left: -36px;

			font-size: 64px;
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

.preview {
	padding-top: 25px;
	border-top: 5px dashed $main-color;
	text-align: center;

	&__title {
		font-size: 36px;
		font-weight: 600;
	}

	&__list {
		width: 40%;
		margin: 20px auto;
		text-align: left;
	}

	&__item {
		display: flex;
		font-size: 24px;
		margin-bottom: 7px;

		&:last-child {
			margin-bottom: 0;
		}

		&.not_full {
			color: $error-color;
		}
	}

	&__field {
		white-space: nowrap;
		font-family: $main-font-bold;
	}

	&__img {
		width: auto;
		height: 100px;
		object-fit: contain;
	}
}

.submit {
	text-align: center;
}

@media (max-width: #{map-get($breakpoints, 'xl')}) {
	.forms {
		&__item {
			padding-left: 60px;
			width: 45%;
			margin-bottom: 50px;

			&::before {
				font-size: 54px;
			}

			&::after {
				width: 90px;
				height: 90px;
			}
		}
	}

	.preview {
		&__list {
			width: 90%;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.forms {
		&__item {
			width: 43%;
			padding-left: 50px;
			margin-bottom: 30px;

			&::before {
				font-size: 46px;
			}

			&::after {
				width: 80px;
				height: 80px;
			}
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.forms {
		&__item {
			width: 100%;
			margin-bottom: 40px;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.forms {
		&__item {
			width: 100%;
			padding-left: 24px;

			&::before {
				font-size: 34px;
			}

			&::after {
				width: 64px;
				height: 64px;
			}
		}
	}
}
</style>
