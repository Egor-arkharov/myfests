<template>
	<the-header />
	<the-sidebar />
	<the-up-btn v-if="mobileView" />
	<router-view />
</template>

<script>
import { ref } from "vue";
import { debounce } from "vue-debounce";
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import TheSidebar from "./components/TheSidebar";
import TheHeader from "./components/TheHeader";
import TheUpBtn from "./components/TheUpBtn";

export default {
	setup() {
		const store = useStore();

		const mobileView = ref(store.getters["getMobileView"]);
		const breakpointXS = store.state.breakpoints.xs;

		onMounted(() => {
			window.addEventListener(
				"resize",
				debounce(() => {
					mobileView.value = window.innerWidth < breakpointXS;
				}, 100)
			);
		});

		if (!store.getters["getFests"].length) {
			onMounted(async () => {
				await store.dispatch("start/loadData");
			});
		}

		return {
			mobileView,
		};
	},
	components: {
		TheHeader,
		TheSidebar,
		TheUpBtn,
	},
};
</script>
