<template>
	<the-header v-if="!$route.path.includes('/sandbox')" />
	<the-sidebar />
	<the-up-btn v-if="mobileView" />
	<router-view />
</template>

<script>
import { ref, computed } from "vue";
import { watch } from "vue";
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

		onMounted(async () => {
			const generatingFestsTotal = computed(
				() => store.getters["fest/getGeneratingFestsTotal"]
			).value;

			const allGeneratedFests = store.getters["fest/getFests"].length;

			if (!allGeneratedFests) {
				console.log("ТУТ ЧТОЛИ??");

				await store.dispatch("init");

				return;
			}

			if (allGeneratedFests < generatingFestsTotal) {
				const generatedFestsNow = computed(
					() => store.getters["fest/getGeneratedFests"]
				).value;

				const delta = generatingFestsTotal - generatedFestsNow;

				console.log("generatedFestsNow", generatedFestsNow);
				console.log("generatedFestsTotalNow", generatingFestsTotal);
				console.log("delta", delta);

				await store.dispatch("fest/generateFests", delta);
			}
		});

		const isLoggedIn = computed(() => store.getters["auth/getLoggedIn"]);

		const festsReseted = computed(() => store.getters["fest/getResetedFests"]);
		const isLooping = computed(() => store.getters["fest/getLooping"]);

		watch(isLoggedIn, () => {
			console.log("Watcher isLoggedIn");

			if (isLooping.value) {
				store.commit("fest/stopGeneration", true);
			} else {
				store.commit("fest/resetFests");
			}
		});

		watch(festsReseted, async (value) => {
			const festsReseted = value;

			console.log("Watcher festsReseted", festsReseted);

			if (festsReseted) {
				store.commit("fest/setResetedFests", false);

				await store.dispatch("fest/loadFests");
			}
		});

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
