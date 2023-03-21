<template>
	<app-page v-if="fest" :title="fest.name">
		<fest-page :fest="fest"></fest-page>
	</app-page>
	<div v-else>Фест утрачен(</div>
</template>

<script>
import AppPage from "../components/ui/App/AppPage.vue";
import FestPage from "../components/ui/Fest/FestPage.vue";
import { ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
	setup() {
		const fest = ref({});
		const store = useStore();
		const route = useRoute();
		const id = route.params.id;

		fest.value = store.getters.getFestsById(id);

		return {
			fest,
		};
	},
	components: {
		AppPage,
		FestPage,
	},
};
</script>
