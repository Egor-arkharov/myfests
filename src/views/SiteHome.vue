<template>
	<app-page title="Home" v-if="fests">
		<h1 class="main__title title" :class="{ animate: titleAnimate }">
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

		<div class="main__body" :class="{ 'loader-backdrop': !isFests }">
			<request-tools v-model="search" @changeView="changeView"></request-tools>

			<app-loader v-if="!isFests"></app-loader>
			<p v-else-if="fests.length === 0" class="search-no">
				We&nbsp;don&rsquo;t have festivals with this artist yet. Try again!
			</p>
			<component :is="'fest-' + view" v-else :fests="fests" />
		</div>
	</app-page>
</template>

<script>
import { ref } from "@vue/runtime-core";
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import AppPage from "../components/ui/App/AppPage.vue";
import AppLoader from "../components/ui/App/AppLoader.vue";
import RequestTools from "../components/request/RequestTools.vue";
import FestTable from "../components/request/fest-view/FestTable.vue";
import FestList from "../components/request/fest-view/FestList.vue";

export default {
	setup() {
		const store = useStore();
		const search = ref();
		const titleAnimate = store.getters["getTitleAnimate"];
		const view = ref("table");

		store.commit("animateTitle");

		const changeView = (viewType) => {
			view.value = viewType;
		};

		const fests = computed(() =>
			store.getters["getFests"].filter((fest) => {
				if (search.value && search.value.length >= 2) {
					return fest.bands.find((item) =>
						item.toLowerCase().includes(search.value.toLowerCase())
					);
				}
				return fest;
			})
		);

		const isFests = computed(() => store.getters["getFests"].length);

		return {
			fests,
			search,
			view,
			isFests,
			changeView,
			titleAnimate,
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
.title {
	font-size: 48px;
	text-align: center;

	margin: 0.5rem 0 1.5rem;

	&__decor-wrapper {
		position: relative;
		font-size: 65px;
	}

	&__decor {
		color: #fff;

		&:nth-child(1) {
			color: transparent;
			-webkit-text-stroke: 1px $main-color;
		}

		&:nth-child(2) {
			position: absolute;
			left: 0;

			color: $main-color;
			animation: text-wave 4s ease-in-out infinite;
		}

		@keyframes text-wave {
			0%,
			100% {
				clip-path: polygon(
					0% 45%,
					16% 44%,
					33% 50%,
					54% 60%,
					70% 61%,
					84% 59%,
					100% 52%,
					100% 100%,
					0% 100%
				);
			}

			50% {
				clip-path: polygon(
					0% 60%,
					15% 65%,
					34% 66%,
					51% 62%,
					67% 50%,
					84% 45%,
					100% 46%,
					100% 100%,
					0% 100%
				);
			}
		}
	}

	&.animate {
		> span {
			opacity: 0;
			filter: blur(4px);
		}

		@for $i from 1 through 7 {
			> span:nth-child(#{$i}) {
				animation: fade-in
					0.8s
					(0.2s + ($i * 0.2))
					forwards
					cubic-bezier(0.11, 0, 0.5, 0);
			}
		}

		@keyframes fade-in {
			100% {
				opacity: 1;
				filter: blur(0);
			}
		}
	}
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

.search-no {
	@include font-m;
	font-family: $main-font-semibold;
	margin: 30px 0;
}

@media (max-width: #{map-get($breakpoints, 'lg')}) {
	.title {
		font-size: 38px;

		&__decor-wrapper {
			font-size: 55px;
		}
	}
}
</style>
