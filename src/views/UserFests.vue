<template>
	<app-page title="My fests" :userFests="true">
		<div v-if="myFests.length">
			<swiper
				:slidesPerGroup="1"
				:grabCursor="true"
				:navigation="true"
				:centeredSlides="true"
				:modules="[Navigation, Controller]"
				:controller="{ control: controlledSwiper }"
				class="swiper-top"
				@swiper="onSwiper"
			>
				<swiper-slide
					v-for="fest in myFests"
					:key="fest.id"
					class="swiper-top__slide"
				>
					<div class="swiper-top__img">
						<fest-img :fest="fest" :myFests="true"></fest-img>
						<p class="swiper-top__text">{{ fest.name }}</p>
					</div>
				</swiper-slide>
			</swiper>
			<swiper
				:allowTouchMove="false"
				:autoHeight="true"
				:modules="[Controller, EffectFade]"
				@swiper="setControlledSwiper"
				effect="fade"
				crossFade="true"
				class="swiper-bottom"
			>
				<swiper-slide
					v-for="fest in myFests"
					:key="fest.id"
					class="swiper-bottom__slide"
				>
					<fest-page :fest="fest" :slide="true"></fest-page>
				</swiper-slide>
			</swiper>
		</div>
		<p v-else class="no-fests">
			There are no&nbsp;festivals yet :(
			<span
				>Add them at&nbsp;the
				<router-link to="/" class="link">home page</router-link>!</span
			>
		</p>
	</app-page>
</template>

<script>
import AppPage from "../components/ui/App/AppPage.vue";
import FestPage from "../components/ui/Fest/FestPage.vue";
import { computed, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Controller, EffectFade } from "swiper";
import FestImg from "@/components/ui/Fest/FestImg.vue";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/effect-fade";

export default {
	setup() {
		const controlledSwiper = ref(null);
		const store = useStore();

		const myFests = computed(() => store.getters["getMyFests"]);

		const setControlledSwiper = (swiper) => {
			controlledSwiper.value = swiper;
		};

		const onSwiper = (swiper) => {
			swiper.params.breakpoints = {
				320: {
					slidesPerView: 2.5,
					spaceBetween: 10,
				},
				600: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
			};
		};

		const getImgUrl = (img) => require("@/assets/images/fests" + img);

		return {
			myFests,
			getImgUrl,
			Navigation,
			Controller,
			EffectFade,
			controlledSwiper,
			setControlledSwiper,
			onSwiper,
		};
	},
	components: {
		Swiper,
		SwiperSlide,
		FestPage,
		FestImg,
		AppPage,
	},
};
</script>

<style lang="scss" scoped>
.swiper {
	opacity: 1;
}

.swiper-top {
	margin-bottom: 50px;

	&__slide {
		display: flex;
		justify-content: center;
		transform: scale(0.8);

		&.swiper-slide-active {
			transform: none;
		}
	}

	&__img {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		user-select: none;
	}

	&__text {
		margin-top: 15px;
		@include font-xl;
		font-weight: normal;
	}
}

.swiper-bottom {
	&__slide {
		background: $white-color;
	}
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.swiper-top {
		margin-bottom: 30px;
	}
}

@media (max-width: #{map-get($breakpoints, 'md')}) {
	.swiper-top {
		margin-bottom: 25px;

		&__text {
			margin-top: 10px;
			@include font-xxl;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'sm')}) {
	.swiper-top {
		margin-bottom: 20px;

		&__text {
			margin-top: 7px;
			@include font-m;
		}
	}
}

@media (max-width: #{map-get($breakpoints, 'xs')}) {
	.swiper-top {
		position: relative;

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

		&__img-img {
			width: 80px;
			height: 80px;
		}

		&__text {
			margin-top: 5px;
			@include font-xs;
		}
	}
}
</style>
