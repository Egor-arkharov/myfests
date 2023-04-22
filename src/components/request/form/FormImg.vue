<template>
	<h4 class="form__title">Choose photo</h4>
	<div class="swiper-wrap" :class="{ active: firstMove }">
		<swiper
			:centeredSlides="true"
			:grabCursor="true"
			:navigation="true"
			:modules="modules"
			@swiper="onSwiper"
			@slidesLengthChange="slidesLengthChange"
			@slideChange="slideChange"
		>
			<swiper-slide v-for="(img, idx) in images" :key="idx" :virtualIndex="idx">
				<div class="img-wrap">
					<picture v-if="img.startsWith('/img-')">
						<source type="image/webp" :srcset="getImgUrl(img, '.webp')" />
						<v-lazy-image
							class="img"
							:src="getImgUrl(img, '.jpg')"
							:alt="'Stock photo for the festival'"
						/>
					</picture>
					<v-lazy-image
						v-else
						class="img"
						:src="img"
						:alt="'Stock photo for the festival'"
					/>
				</div>
			</swiper-slide>
		</swiper>
	</div>

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
import VLazyImage from "v-lazy-image";
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

			swiper.params.breakpoints = {
				320: {
					slidesPerView: 1.5,
					spaceBetween: 10,
				},
				600: {
					slidesPerView: 2.5,
					spaceBetween: 40,
				},
			};
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

		const getImgUrl = (img, type) =>
			require("@/assets/images/fests" + img + type);

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
		VLazyImage,
	},
};
</script>

<style lang="scss" scoped>
$this-color: $color-8;

.swiper-wrap {
	position: relative;

	&::before {
		content: "";
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

.swiper {
	height: 200px;
	margin-bottom: 10px;
	padding: 20px 0;

	&::before,
	&::after {
		content: "";
		position: absolute;

		top: 0;
		width: 50px;
		height: 100%;

		background-color: $white-color;
		filter: blur(20px);
		z-index: 2;
	}

	&::before {
		left: 0;
	}

	&:after {
		right: 0;
	}
}

.swiper-slide {
	display: flex;
	justify-content: center;
	overflow: hidden;
	transform: scale(0.8);

	&-active {
		transform: none;
	}

	.img-wrap {
		user-select: none;
		width: 100%;
	}

	img {
		object-fit: cover;
		width: 100%;
		height: 100%;
		transform: scale(1.5);
	}
}

.form-file {
	align-items: center;

	&__label {
		position: relative;
		width: 50%;
		height: 100px;
		border: 2px dashed $this-color;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		margin: 20px 0;
		cursor: pointer;

		input {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			color: transparent;
			cursor: pointer;

			&::-webkit-file-upload-button,
			&::file-selector-button {
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

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.form-file {
		align-items: flex-start;
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.swiper-wrap,
	.form {
		margin-top: 30px;
		margin-left: -64px;
		margin-right: -5px;
	}

	.swiper-wrap::before {
		width: 75%;
	}

	.swiper::before {
		width: 40px;
	}

	.form-file {
		&__label {
			width: 100%;
		}
	}
}
</style>
