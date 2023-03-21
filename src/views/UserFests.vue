<template>
	<app-page title="My-fests">
		<div v-if="myFests.length">
			<swiper
				:slidesPerView="3"
				:spaceBetween="30"
				:slidesPerGroup="1"
				:grabCursor="true"
				:navigation="true"
				:centeredSlides="true"
				:modules="[Navigation, Controller]"
				:controller="{ control: controlledSwiper }"
				class="swiper-top"
			>
				<swiper-slide
					v-for="fest in myFests"
					:key="fest.id"
					class="swiper-top__slide"
				>
					<div class="swiper-top__img">
						<picture v-if="fest.img.startsWith('/img-')">
							<source
								type="image/webp"
								:srcset="getImgUrl(fest.img + '.webp')"
							/>
							<img
								class="swiper-top__img-img"
								:src="getImgUrl(fest.img + '.jpg')"
								:alt="'Photo of the ' + fest.name + ' festival'"
							/>
						</picture>
						<img v-else class="swiper-top__img-img" :src="fest.img" alt="hi" />
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
					<fest-page :fest="fest"></fest-page>
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

		const getImgUrl = (img) => require("@/assets/images/fests" + img);

		return {
			myFests,
			getImgUrl,
			Navigation,
			Controller,
			EffectFade,
			controlledSwiper,
			setControlledSwiper,
		};
	},
	components: {
		Swiper,
		SwiperSlide,
		FestPage,
		AppPage,
	},
};
</script>

<style lang="scss" scoped>
:root {
	--swiper-theme-color: red; // ???????????????????
}

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

		&-img {
			width: 150px;
			height: 150px !important;
			object-fit: cover;
			border-radius: 50%;
			height: 100%;
		}
	}

	&__text {
		margin-top: 15px;
		font-size: 22px;
		font-weight: normal;
	}
}

.swiper-bottom {
	&__slide {
		background: $white-color;
		// opacity: 0 !important;

		// &.swiper-slide-active {
		// 	opacity: 1 !important;
		// }
	}
}

.no-fests {
	@include font-m;
	font-family: $main-font-semibold;
	margin: 30px 0;
	text-align: center;

	span {
		display: block;
		margin-top: 10px;
	}
}

.link {
	font-family: $main-font-bold;
	color: $main-color;

	@include hover {
		color: darken($main-color, 20%);
	}
}
</style>
