<template>
	<div class="card center">
		<swiper
			v-if="myFests.length"
			:slidesPerView="1"
			:spaceBetween="100"
			:slidesPerGroup="1"
			:loop="true"
			:loopFillGroupWithBlank="true"
			:navigation="true"
			:modules="modules"
			class="mySwiper"
		>
			<swiper-slide v-for="fest in myFests" :key="fest.id">
				<h2>{{ fest.name }}</h2>
				<p class="code">{{ fest }}</p>
			</swiper-slide>
		</swiper>
		<p v-else>Фестов нет(</p>
	</div>
</template>

<script>
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
	},
};
</script>

<style scoped lang="scss">
.swiper {
	margin: 20px 0;
	background-color: lightblue;
	cursor: grab;
}

.swiper-slide {
	background-color: lightcoral;
}

.code {
	white-space: pre;
}
</style>
