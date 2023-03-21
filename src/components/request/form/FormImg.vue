<template>
	<h4 class="title__form">Choose photo</h4>
	<swiper
		:slidesPerView="2.5"
		:centeredSlides="true"
		:spaceBetween="40"
		:grabCursor="true"
		:navigation="true"
		:modules="modules"
		@swiper="onSwiper"
		@slidesLengthChange="slidesLengthChange"
		@slideChange="slideChange"
		:class="{ active: firstMove }"
	>
		<swiper-slide v-for="(img, idx) in images" :key="idx" :virtualIndex="idx">
			<img
				v-if="img.startsWith('/img-')"
				class="img"
				:src="getImgUrl(img)"
				alt="img"
			/>
			<img v-else class="img" :src="img" alt="imgcustom" />
		</swiper-slide>
	</swiper>

	<form class="form form-file" @submit.prevent="submitImg">
		<label
			for="form-file"
			class="form-file__label"
			:class="{ error: errorType, 'error-animate': errorAnimate }"
		>
			<input
				type="file"
				name="fest-img"
				@change="loadImg"
				accept="image/jpeg"
			/>
			<span>... or load your file!</span>
			<span class="form-file__valid"> only .jpeg</span>
		</label>

		<button
			class="form__button btn btn--form"
			:class="{ added: isChange }"
			type="submit"
			:disabled="!firstMove"
		>
			{{ getButtonText() }}
		</button>
	</form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper";
import "swiper/scss";
import "swiper/scss/navigation";

export default {
	emits: ["submit"],
	setup(_, { emit }) {
		const isChange = ref(false);
		const isAdded = ref(false);
		const swiperDefault = ref("");
		const store = useStore();
		const fileAcceptType = "jpeg";
		const errorType = ref(false);
		const errorAnimate = ref(false);
		const imgSrc = ref("");

		const swiperInit = ref(false);
		const firstMove = ref(false);

		const loadImg = (evt) => {
			const file = evt.target.files[0];
			if (!file) return;

			const reader = new FileReader();
			reader.readAsDataURL(file);

			if (file.type.slice(-4) === fileAcceptType) {
				errorType.value = false;
				errorAnimate.value = false;
				reader.onload = () => {
					imgSrc.value = reader.result;
					images.push(imgSrc.value);
				};
			} else {
				errorType.value = true;
				errorAnimate.value = true;
				imgSrc.value = "";

				setTimeout(() => {
					errorAnimate.value = false;
				}, 400);
			}
		};

		const images = store.getters["start/getFreeImg"];

		const onSwiper = (swiper) => {
			swiperDefault.value = swiper;
			swiperInit.value = true;
		};

		const slidesLengthChange = (swiper) => {
			if (swiperInit.value) {
				swiperDefault.value.slideTo(swiper.slides.length);
			}
		};

		const slideChange = () => {
			firstMove.value = true;
			isChange.value = false;
		};

		const getImgUrl = (img) => require("@/assets/images/fests" + img + ".jpg");

		const submitImg = () => {
			emit("submit", images[swiperDefault.value.activeIndex]);
			isChange.value = true;
			isAdded.value = true;
		};

		const getButtonText = () => {
			let btnText = "Add Photo";

			if (isAdded.value) {
				btnText = "Photo Added";
			}

			if (isAdded.value && !isChange.value) {
				btnText = "Update Photo";
			}

			return btnText;
		};

		return {
			isChange,
			imgSrc,
			errorType,
			errorAnimate,
			firstMove,
			getButtonText,
			loadImg,
			submitImg,
			images,
			getImgUrl,
			modules: [Navigation],
			onSwiper,
			slidesLengthChange,
			slideChange,
		};
	},
	components: {
		Swiper,
		SwiperSlide,
	},
};
</script>

<style lang="scss" scoped>
$this-color: $color-8;

.swiper {
	height: 200px;
	margin-bottom: 10px;
	padding: 20px 0;

	&::before {
		content: "";
		position: absolute;

		position: absolute;
		width: 45%;
		height: 100%;
		top: 0;
		left: 50%;
		transform: translate(-50%, 0) scale(0.95);

		border: 2px solid rgba($this-color, 0.2);
	}

	&.active {
		&::before {
			border: 2px solid $this-color;
		}
	}
}

.swiper-slide {
	overflow: hidden;
	transform: scale(0.8);

	&-active {
		transform: none;
	}

	img {
		object-fit: cover;
		height: 100%;
		transform: scale(1.5);
	}
}

.form-file {
	&__label {
		position: relative;
		width: 100%;
		height: 100px;
		border: 2px dashed $this-color;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		cursor: pointer;

		input {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			color: transparent;
			cursor: pointer;

			&::-webkit-file-upload-button {
				visibility: hidden;
			}
		}
	}

	&__valid {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 10px;
		display: block;
		margin-top: 10px;
	}

	&__buttons {
		display: flex;
	}
}

.btn--clear {
	margin-left: 10px;
}

.error {
	border-color: $error-color;

	.form-file__valid {
		color: $error-color;
	}

	&-animate {
		animation: error-file 0.4s linear;

		@keyframes error-file {
			0% {
				transform: translate(30px);
			}
			20% {
				transform: translate(-30px);
			}
			40% {
				transform: translate(15px);
			}
			60% {
				transform: translate(-15px);
			}
			80% {
				transform: translate(8px);
			}
			100% {
				transform: translate(0px);
			}
		}
	}
}
</style>
