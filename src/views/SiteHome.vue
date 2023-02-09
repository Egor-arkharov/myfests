<template>
	<app-page title="Home" v-if="fests">
		<h1 class="title">
			<span>Find </span>
			<span>or </span>
			<span>create </span>
			<span class="title__decor-wrapper">
				<span class="title__decor">your </span>
				<span class="title__decor">your </span>
			</span>
			<span>unreal </span>
			<span>music </span>
			<span>festival</span>
		</h1>

		<div :class="{ 'loader-backdrop': !isFests }">
			<div :style="!isFests ? 'opacity: 0.6;' : ''">
				<request-tools
					v-model="search"
					@changeView="changeView"
				></request-tools>
			</div>

			<app-loader v-if="!isFests"></app-loader>
			<p v-else-if="fests.length === 0">Фестивалей с таким артистом нет(</p>
			<component :is="'fest-' + view" v-else :fests="fests" />
		</div>
	</app-page>
</template>

<script>
import AppPage from "../components/ui/AppPage.vue";
import AppLoader from "../components/ui/AppLoader.vue";
import FestTable from "../components/request/fest-view/FestTable.vue";
import FestList from "../components/request/fest-view/FestList.vue";
import RequestTools from "../components/request/RequestTools.vue";
import { onMounted, ref } from "@vue/runtime-core";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
	setup() {
		const store = useStore();
		const search = ref();
		const view = ref("table");

		const changeView = (viewType) => {
			view.value = viewType;
		};

		if (!store.getters["getFests"].length) {
			store.getters["getFests"].length;

			onMounted(async () => {
				await store.dispatch("load/loadData");
			});
		}

		const fests = computed(() =>
			store.getters["getFests"].filter((fest) => {
				if (search.value && search.value.length >= 2) {
					console.log(view);

					return fest.bands.find((item) =>
						item.toLowerCase().includes(search.value.toLowerCase())
					);
				}
				return fest;
			})
		);

		// const fests = [];

		const isFests = computed(() => store.getters["getFests"].length);

		return {
			fests,
			search,
			view,
			isFests,
			changeView,
		};
	},
	components: {
		AppPage,
		AppLoader,
		FestTable,
		RequestTools,
		FestList,
	},
};
</script>

<style lang="scss" scoped>
.card__title {
	display: none;
}

.title {
	font-size: 48px;
	text-align: center;

	margin: 15px 0;

	&__decor-wrapper {
		position: relative;
		font-size: 65px;
	}

	// &__decor {
	// 	color: #fff;

	// 	&:nth-child(1) {
	// 		color: transparent;
	// 		-webkit-text-stroke: 1px $btn-color;
	// 	}

	// 	&:nth-child(2) {
	// 		position: absolute;
	// 		left: 0;

	// 		color: $btn-color;
	// 		animation: text-wave 4s ease-in-out infinite;
	// 	}

	// 	@keyframes text-wave {
	// 		0%,
	// 		100% {
	// 			clip-path: polygon(
	// 				0% 45%,
	// 				16% 44%,
	// 				33% 50%,
	// 				54% 60%,
	// 				70% 61%,
	// 				84% 59%,
	// 				100% 52%,
	// 				100% 100%,
	// 				0% 100%
	// 			);
	// 		}

	// 		50% {
	// 			clip-path: polygon(
	// 				0% 60%,
	// 				15% 65%,
	// 				34% 66%,
	// 				51% 62%,
	// 				67% 50%,
	// 				84% 45%,
	// 				100% 46%,
	// 				100% 100%,
	// 				0% 100%
	// 			);
	// 		}
	// 	}
	// }

	// > span {
	// 	opacity: 0;
	// 	filter: blur(4px);
	// }

	// @for $i from 1 through 7 {
	// 	> span:nth-child(#{$i}) {
	// 		animation: fade-in
	// 			0.8s
	// 			(0.2s + ($i * 0.2))
	// 			forwards
	// 			cubic-bezier(0.11, 0, 0.5, 0);
	// 	}
	// }

	// @keyframes fade-in {
	// 	100% {
	// 		opacity: 1;
	// 		filter: blur(0);
	// 	}
	// }
}

.loader-backdrop {
	position: relative;
	pointer-events: none;

	&::before {
		content: "";
		position: absolute;

		width: calc(100% + 20px);
		height: calc(100% + 20px);

		transform: translate(-10px, -10px);

		background-color: rgba(255, 255, 255, 0.6);
		border-radius: 10px;
	}
}
</style>
