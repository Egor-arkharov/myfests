<template>
	<app-page v-if="fest" :title="fest.name">
		<fest-page :fest="fest"></fest-page>
	</app-page>

	<app-page v-else :title="'No fest'">
		<p class="no-fests">
			This page id&nbsp;is&nbsp;out of&nbsp;date :(
			<span
				>Maybe you will find festivals on&nbsp;the
				<router-link to="/" class="link">home page</router-link>!</span
			>
		</p>
	</app-page>
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
