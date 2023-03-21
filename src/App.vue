<template>
	<the-header />
	<the-sidebar />
	<router-view />
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import TheSidebar from "./components/TheSidebar";
import TheHeader from "./components/TheHeader";

export default {
	setup() {
		const store = useStore();

		if (!store.getters["getFests"].length) {
			onMounted(async () => {
				await store.dispatch("start/loadData");
			});
		}
	},
	components: {
		TheHeader,
		TheSidebar,
	},
};
</script>
