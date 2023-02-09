<template>
	<app-page title="My-fests">
		<swiper
			v-if="myFests.length"
			:slidesPerView="1"
			:spaceBetween="100"
			:slidesPerGroup="1"
			:navigation="true"
			:modules="modules"
			class="mySwiper"
		>
			<swiper-slide v-for="fest in myFests" :key="fest.id">
				<fest-page :fest="fest"></fest-page>
			</swiper-slide>
		</swiper>
		<p v-else>Фестов нет(</p>
	</app-page>
</template>

<script>
import AppPage from "../components/ui/AppPage.vue";
import FestPage from "../components/ui/FestPage.vue";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";

export default {
	setup() {
		const store = useStore();

		const myFests = computed(() => store.getters["getMyFests"]);

		const onSwiper = (swiper) => {
			console.log(swiper);
		};

		const onSlideChange = () => {
			console.log("slide change");
		};

		return {
			myFests,
			onSwiper,
			onSlideChange,
			modules: [Navigation],
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

<style scoped lang="scss">
.swiper {
	opacity: 1;
}
</style>
