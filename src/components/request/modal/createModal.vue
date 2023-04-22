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
				class="forms__item forms__item--big visuallyhidden"
				ref="formBandsDom"
			>
				<form-bands @submit="submitBands" :genre="festGenre"></form-bands>
			</li>
			<li class="forms__item forms__item--big visuallyhidden" ref="formImgDom">
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
		<div class="preview__list">
			<fest-desc :fest="fest"></fest-desc>
		</div>

		<button class="btn btn--form-main" :disabled="!festBands.length">
			Submit
		</button>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed, watchEffect } from "@vue/runtime-core";
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
		const formBandsDom = ref(null);
		const formImgDom = ref(null);
		const onceScroll = ref(false);

		const submitName = (festNamefromComp) =>
			(festName.value = festNamefromComp);

		const submitPlace = (festPlaceFromComp) =>
			(festPlace.value = festPlaceFromComp);

		const submitDate = (festDatefromComp) =>
			(festDate.value = festDatefromComp);

		const submitGenre = (festGenreFromComp) => {
			festHeadliners.value = [];
			festBands.value = [];
			festGenre.value = festGenreFromComp;
		};

		const submitBands = (festBandsFromComp) => {
			festHeadliners.value = festBandsFromComp.headliners;
			festBands.value = festBandsFromComp.bands;
		};

		const submitImg = (festImgFromComp) => {
			festImg.value = festImgFromComp;
		};

		watchEffect(() => {
			if (!onceScroll.value) {
				if (
					festGenre.value &&
					formBandsDom.value.classList.contains("visuallyhidden")
				) {
					formBandsDom.value.classList.remove("visuallyhidden");
					formBandsDom.value.scrollIntoView({ behavior: "smooth" });
				}

				if (
					festBands.value.length &&
					formImgDom.value.classList.contains("visuallyhidden")
				) {
					formImgDom.value.classList.remove("visuallyhidden");
					formImgDom.value.scrollIntoView({ behavior: "smooth" });
				}

				if (preview.value) {
					preview.value.scrollIntoView({ behavior: "smooth" });
					onceScroll.value = true;
				}
			}
		});

		const fest = computed(() => {
			return {
				name: festName.value,
				place: festPlace.value,
				date: {
					start: festDate.value[0],
					end: festDate.value[1],
					fullDateStart: festDate.value[2],
				},
				genre: festGenre.value,
				headliners: festHeadliners.value,
				bands: festBands.value,
				img: festImg.value,
				fromModal: true,
			};
		});

		const submitAll = () => {
			store.commit("addFest", fest.value);
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
			formBandsDom,
			formImgDom,
			fest,
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
.forms {
	&__list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		padding-left: 40px;

		list-style: none;
		counter-reset: counter;
	}

	&__item {
		position: relative;
		counter-increment: counter;
		width: 20%;
		padding-left: 70px;
		margin-bottom: 70px;

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
}

.submit {
	text-align: center;
}

.visuallyhidden {
	margin: 0;

	&::before,
	&::after {
		content: none;
	}
}

@media (max-width: #{map-get($breakpoints, 'xl')}) {
	.forms {
		&__item {
			padding-left: 60px;
			width: 45%;
			margin-bottom: 50px;

			&--big {
				width: 100%;
			}

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
				font-size: 28px;
			}

			&::after {
				width: 58px;
				height: 58px;
			}
		}
	}
}
</style>
