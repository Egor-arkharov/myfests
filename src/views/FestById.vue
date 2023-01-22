<template>
	<app-page v-if="fest" :title="fest.name">
		<img v-if="fest.img" class="img" :src="getImgUrl(fest)" />

		<!-- <picture>
              <source type="image/webp" srcset="img/mob/main_top_img@1x.webp">

				<img class="info__image" src="img/mob/main_top_img@1x.png" alt="">
        </picture> -->
		<p>
			<strong>Место: </strong
			>{{ fest.place.name + ", " + fest.place.countryName }}
		</p>
		<p><strong>Дата: </strong>{{ fest.date }}</p>
		<p><strong>Жанр: </strong>{{ fest.genre }}</p>
		<p><strong>Хедлайнеры: </strong>{{ fest.headliners.join(", ") }}</p>
		<p><strong>Группы: </strong>{{ fest.bands.join(", ") }}</p>
		<div id="map"></div>
	</app-page>
	<div v-else>Фест утрачен(</div>
</template>

<script>
import AppPage from "../components/ui/AppPage.vue";
import { onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
	setup() {
		const fest = ref({});
		const store = useStore();
		const route = useRoute();
		const id = route.params.id;

		fest.value = store.getters.getFestsById(id);

		const getImgUrl = (fest) => {
			return require("@/assets/images" + fest.img);
		};

		onMounted(async () => {
			await store.dispatch("loadMap", fest);
		});

		return {
			fest,
			getImgUrl,
		};
	},
	components: {
		AppPage,
	},
};
</script>

<style lang="scss" scoped>
.img {
	display: block;
	width: 100%;
	height: 400px;

	margin: 20px auto;
	object-fit: cover;
}

#map {
	width: 30%;
	margin-left: auto;
	height: 300px;
}
</style>
