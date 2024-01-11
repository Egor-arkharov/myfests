<template>
	<the-header v-if="!$route.path.includes('/sandbox')" />
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
		const mobileView = ref(store.getters["settings/getMobileView"]);
		const breakpointXS = store.state.settings.breakpoints.xs;

		console.log("localStorage", localStorage);

		store.dispatch("auth/initAuth");

		onMounted(() => {
			window.addEventListener(
				"resize",
				debounce(() => {
					mobileView.value = window.innerWidth < breakpointXS;
				}, 100)
			);
		});

		if (!store.getters["fest/getFests"].length) {
			onMounted(async () => {
				await store.dispatch("init");
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
